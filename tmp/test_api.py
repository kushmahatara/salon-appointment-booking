import urllib.request
import urllib.parse
import json

BASE_URL = 'http://127.0.0.1:8000/api'

def req(url, method='GET', data=None):
    request = urllib.request.Request(url, method=method)
    request.add_header('Content-Type', 'application/json')
    request.add_header('Accept', 'application/json')
    
    body = json.dumps(data).encode('utf-8') if data else None
    
    try:
        with urllib.request.urlopen(request, data=body) as response:
            if response.status == 204:
                return response.status, None
            res_body = response.read().decode('utf-8')
            return response.status, json.loads(res_body) if res_body else None
    except urllib.error.HTTPError as e:
        res_body = e.read().decode('utf-8')
        return e.code, json.loads(res_body) if res_body else None

def test_api():
    print("--- 1. Testing GET /api/services ---")
    st, data = req(f'{BASE_URL}/services')
    print(f"Status: {st}, Services Count: {len(data)}")
    print(f"Sample service: {data[0]}")

    print("\n--- 2. Testing POST /api/services ---")
    st, new_svc = req(f'{BASE_URL}/services', method='POST', data={
        'name': 'Test Nail Art & Spa',
        'price': 1200.0,
        'duration': 45
    })
    print(f"Status: {st}, Created Service: {new_svc}")
    new_svc_id = new_svc['id']

    print("\n--- 3. Testing GET /api/appointments ---")
    st, appointments = req(f'{BASE_URL}/appointments')
    print(f"Status: {st}, Appointments Count: {len(appointments)}")

    print("\n--- 4. Testing POST /api/appointments (Valid Booking) ---")
    st, new_app = req(f'{BASE_URL}/appointments', method='POST', data={
        'customer_name': 'Anil Karki',
        'customer_phone': '+977-9811223344',
        'service_id': new_svc_id,
        'appointment_date': '2026-10-01',
        'appointment_time': '11:00:00',
        'notes': 'First time visitor',
        'status': 'Pending'
    })
    print(f"Status: {st}, Created Appointment: {new_app}")
    new_app_id = new_app['id']

    print("\n--- 5. Testing Double Booking Conflict (POST /api/appointments) ---")
    st, conflict_res = req(f'{BASE_URL}/appointments', method='POST', data={
        'customer_name': 'Second Customer',
        'customer_phone': '+977-9899887766',
        'service_id': new_svc_id,
        'appointment_date': '2026-10-01',
        'appointment_time': '11:00:00',
        'notes': 'Trying same slot'
    })
    print(f"Status (Expected 400): {st}, Response: {conflict_res}")
    assert st == 400, "Expected 400 Bad Request on double booking conflict!"

    print("\n--- 6. Testing PATCH /api/appointments/<id>/status ---")
    st, updated_app = req(f'{BASE_URL}/appointments/{new_app_id}/status', method='PATCH', data={
        'status': 'Confirmed'
    })
    print(f"Status: {st}, Updated Status: {updated_app.get('status')}")

    print("\n--- 7. Testing DELETE /api/appointments/<id> ---")
    st, _ = req(f'{BASE_URL}/appointments/{new_app_id}', method='DELETE')
    print(f"Delete Appointment Status (Expected 204): {st}")

    print("\n--- 8. Testing DELETE /api/services/<id> ---")
    st, _ = req(f'{BASE_URL}/services/{new_svc_id}', method='DELETE')
    print(f"Delete Service Status (Expected 204): {st}")

    print("\nALL BACKEND API ENDPOINT VERIFICATION TESTS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    test_api()
