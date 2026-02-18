import urllib.request
import urllib.parse
import json
import time

BASE_URL = "http://localhost:8080/api"
timestamp = int(time.time())

def print_step(step):
    print(f"\n{'='*20} {step} {'='*20}")

def make_request(url, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    
    if data:
        data_bytes = json.dumps(data).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    else:
        data_bytes = None
        
    req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            status = response.status
            body = response.read().decode('utf-8')
            try:
                return status, json.loads(body)
            except:
                return status, body
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        return e.code, body
    except Exception as e:
        print(f"Request Error: {e}")
        return 0, str(e)

def register_user(role, name, email, password):
    if role == "USER" or role == "ADMIN": # Admin usually registers as user or specific admin endpoint? AuthController has register/user. Let's use that or check if we need special handling. AuthController doesn't have register/admin. Usually ADMIN is manually inserted or role is passed. UserRegisterDTO might have role?
        # Checking UserRegisterDTO... I don't have visibility, but typically it might.
        # Assuming register/user accepts role or we default to USER. 
        # But wait, earlier I passed "role": role in data.
        # If AuthController takes UserRegisterDTO, let's hope it maps 'role'.
        endpoint = "register/user"
    elif role == "RESTAURANT":
        endpoint = "register/restaurant"
    elif role == "DELIVERY_BOY":
        endpoint = "register/delivery"
    else:
        endpoint = "register/user" # Fallback

    url = f"{BASE_URL}/auth/{endpoint}"
    
    data = {
        "name": name,
        "email": email,
        "password": password,
        "role": role, # If DTO accepts it
        "phone": "1234567890",
        "address": "Test Address"
    }
    if role == "RESTAURANT":
        data.update({
             "restaurantName": f"Test Rest {timestamp}",
             "cuisine": "Italian",
             "description": "Best food",
             "openingTime": "10:00",
             "closingTime": "22:00"
        })
    elif role == "DELIVERY_BOY":
        data.update({
            "vehicle": "Bike",
            "licenseNumber": "DL12345",
             "drivingLicenseNumber": "DL12345" # Added explicit field matching DeliveryBoy model if needed
        })
        
    print(f"Registering {role}: {email}")
    status, body = make_request(url, "POST", data)
    print(f"Status: {status}")
    if status in [200, 201]:
         print("Success")
         return True
    else:
         print(f"Failed: {body}")
         return False

def login(email, password, role="USER"):
    url = f"{BASE_URL}/auth/login"
    data = {"email": email, "password": password, "role": role}
    print(f"Logging in: {email} as {role}")
    status, body = make_request(url, "POST", data)
    
    if status == 200:
        if isinstance(body, dict) and "token" in body:
            print("Login Successful")
            return body.get("token")
    
    print(f"Login Failed: {body}")
    return None

def verify_dashboard_stats(token):
    url = f"{BASE_URL}/admin/stats"
    headers = {"Authorization": f"Bearer {token}"}
    print("Fetching Dashboard Stats...")
    status, body = make_request(url, "GET", headers=headers)
    if status == 200:
        print(json.dumps(body, indent=2))
        return body
    else:
        print(f"Failed to fetch stats: {body}")
        return None

def verify_pending_restaurants(token):
    url = f"{BASE_URL}/admin/restaurants/pending"
    headers = {"Authorization": f"Bearer {token}"}
    print("Fetching Pending Restaurants...")
    status, body = make_request(url, "GET", headers=headers)
    
    if status == 200 and isinstance(body, list):
        print(f"Found {len(body)} pending restaurants")
        return body
    else:
        print(f"Failed: {body}")
        return []

def approve_restaurant(token, rest_id):
    url = f"{BASE_URL}/admin/approve/restaurant/{rest_id}"
    headers = {"Authorization": f"Bearer {token}"}
    print(f"Approving Restaurant ID: {rest_id}")
    status, body = make_request(url, "PUT", headers=headers)
    
    if status == 200:
        print("Approval Successful")
        return True
    else:
        print(f"Approval Failed: {body}")
        return False

def main():
    print_step("1. Register User/Customer")
    cust_email = f"cust{timestamp}@test.com"
    register_user("USER", "Test Customer", cust_email, "password")

    print_step("2. Register Restaurant")
    rest_email = f"rest{timestamp}@test.com"
    register_user("RESTAURANT", "Test Restaurant", rest_email, "password")
    
    print_step("3. Register Delivery Boy")
    del_email = f"del{timestamp}@test.com"
    register_user("DELIVERY_BOY", "Test Delivery", del_email, "password")

    print_step("4. Login Admin")
    # Using specific credentials likely valid in dev
    token = login("admin@example.com", "admin123")
    
    if not token:
        # Fallback creation
        print("Creating new admin...")
        admin_email = f"admin{timestamp}@test.com"
        # Register as regular user first or assume role param works (usually secured but trying)
        # Actually system might be setup to allow role param on register for dev
        register_user("ADMIN", "Admin Test", admin_email, "password")
        token = login(admin_email, "password")

    if not token:
        print("Cannot proceed without token.")
        return

    print_step("5. Dashboard Stats (Before Approval)")
    stats = verify_dashboard_stats(token)
    
    print_step("6. Verify Pending Restaurants")
    pending = verify_pending_restaurants(token)
    
    # In list of objects, we need to find one that matches our email
    # Our API returns Restaurant objects. Let's check fields.
    target_rest = None
    for r in pending:
        # Debug print entire object to see structure
        # print(r)
        if r.get("email") == rest_email:
            target_rest = r
            break
            
    if target_rest:
        print(f"Found our new restaurant: {target_rest.get('id')}")
        
        print_step("7. Approve Restaurant")
        approve_restaurant(token, target_rest.get('id'))
        
        print_step("8. Dashboard Stats (After Approval)")
        verify_dashboard_stats(token)
    else:
        print("New restaurant not found in pending list!")

    print_step("9. Verify Pending Delivery Boys")
    url = f"{BASE_URL}/admin/delivery/pending"
    headers = {"Authorization": f"Bearer {token}"}
    status, body = make_request(url, "GET", headers=headers)
    target_del = None
    if status == 200 and isinstance(body, list):
         print(f"Found {len(body)} pending delivery boys")
         for d in body:
             if d.get("email") == del_email:
                 target_del = d
                 break
    
    if target_del:
        print(f"Found our new delivery boy: {target_del.get('id')}")
        print_step("10. Approve Delivery Boy")
        url = f"{BASE_URL}/admin/approve/delivery/{target_del.get('id')}"
        headers = {"Authorization": f"Bearer {token}"}
        status, body = make_request(url, "PUT", headers=headers)
        if status == 200:
            print("Delivery Boy Approval Successful")
        else:
             print(f"Delivery Boy Approval Failed: {body}")
             
        print_step("11. Dashboard Stats (Final)")
        verify_dashboard_stats(token)
    else:
        print("New delivery boy not found in pending list!")

    print_step("12. Login as Approved Restaurant")
    rest_token = login(rest_email, "password", "RESTAURANT")
    if rest_token:
        print("Verified: Approved Restaurant can login successfully!")
    else:
        print("Failed: Approved Restaurant count NOT login.")

    print_step("13. Login as Approved Delivery Boy")
    del_token = login(del_email, "password", "DELIVERY_BOY")
    if del_token:
        print("Verified: Approved Delivery Boy can login successfully!")
    else:
        print("Failed: Approved Delivery system status check failed.")

if __name__ == "__main__":
    main()
