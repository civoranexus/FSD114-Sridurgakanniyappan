from django.http import JsonResponse
from django.contrib.auth import authenticate

def login(request):
    # Handle GET request (browser test)
    if request.method == "GET":
        return JsonResponse(
            {"detail": "Method GET not allowed."},
            status=405
        )

    # Handle POST request (real login)
    if request.method == "POST":
        import json
        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")

        user = authenticate(username=email, password=password)

        if user is not None:
            return JsonResponse({
                "success": True,
                "message": "Login successful",
                "role": user.role
            })

        return JsonResponse({
            "success": False,
            "message": "Invalid credentials"
        }, status=401)
def register(request):
    if request.method == "POST":
        import json
        from .models import User

        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")
        role = data.get("role")

        if User.objects.filter(username=email).exists():
            return JsonResponse({
                "success": False,
                "message": "User already exists"
            }, status=400)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            role=role
        )

        return JsonResponse({
            "success": True,
            "message": "User registered successfully"
        })

    return JsonResponse(
        {"detail": "Method not allowed."},
        status=405
    )   