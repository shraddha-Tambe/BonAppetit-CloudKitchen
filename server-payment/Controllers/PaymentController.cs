using Microsoft.AspNetCore.Mvc;
using PaymentService.Data;
using PaymentService.Models;
using Razorpay.Api;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace PaymentService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly PaymentDbContext _context;

        public PaymentController(IConfiguration configuration, PaymentDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderRequest request)
        {
            try
            {
                string keyId = _configuration["Razorpay:KeyId"]!;
                string keySecret = _configuration["Razorpay:KeySecret"]!; // Ensure this is not null

                RazorpayClient client = new RazorpayClient(keyId, keySecret);

                Dictionary<string, object> options = new Dictionary<string, object>
                {
                    { "amount", request.Amount * 100 }, // Amount in paise
                    { "currency", "INR" },
                    { "receipt", "txn_" + Guid.NewGuid().ToString() },
                    { "payment_capture", 1 } // Auto capture
                };

                Order order = client.Order.Create(options);
                string orderId = order["id"].ToString();

                var paymentOrder = new PaymentOrder
                {
                    RazorpayOrderId = orderId,
                    Amount = request.Amount,
                    Status = "Created",
                    CreatedAt = DateTime.UtcNow
                };

                _context.PaymentOrders.Add(paymentOrder);
                await _context.SaveChangesAsync();

                return Ok(new { orderId = orderId, amount = request.Amount, keyId = keyId });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] CreateOrder Failed: {ex}");
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("verify-payment")]
        public async Task<IActionResult> VerifyPayment([FromBody] PaymentVerificationRequest request)
        {
            try
            {
                string keySecret = _configuration["Razorpay:KeySecret"]!;
                
                // Construct the signature string
                string generatedSignature = ComputeSha256Hash(request.OrderId + "|" + request.PaymentId, keySecret);

                if (generatedSignature == request.Signature)
                {
                    var order = _context.PaymentOrders.FirstOrDefault(o => o.RazorpayOrderId == request.OrderId);
                    if (order != null)
                    {
                        order.RazorpayPaymentId = request.PaymentId;
                        order.RazorpaySignature = request.Signature;
                        order.Status = "Paid";
                        await _context.SaveChangesAsync();
                        
                        return Ok(new { status = "success", message = "Payment verified successfully" });
                    }
                    return NotFound(new { message = "Order not found" });
                }
                else
                {
                    return BadRequest(new { status = "failed", message = "Invalid payment signature" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.PaymentOrders.OrderByDescending(o => o.CreatedAt).ToListAsync();
            return Ok(orders);
        }

        private static string ComputeSha256Hash(string rawData, string secret)
        {
            using (var hmac = new HMACSHA256(Encoding.ASCII.GetBytes(secret)))
            {
                var hash = hmac.ComputeHash(Encoding.ASCII.GetBytes(rawData));
                return BitConverter.ToString(hash).Replace("-", "").ToLower();
            }
        }
    }

    public class OrderRequest
    {
        public decimal Amount { get; set; }
    }

    public class PaymentVerificationRequest
    {
        public string OrderId { get; set; } = string.Empty;
        public string PaymentId { get; set; } = string.Empty;
        public string Signature { get; set; } = string.Empty;
    }
}
