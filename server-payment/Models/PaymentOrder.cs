using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PaymentService.Models
{
    public class PaymentOrder
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string RazorpayOrderId { get; set; } = string.Empty;

        public string? RazorpayPaymentId { get; set; }

        public string? RazorpaySignature { get; set; }

        public decimal Amount { get; set; }

        public string Currency { get; set; } = "INR";

        public string Status { get; set; } = "Created"; // Created, Paid, Failed

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
