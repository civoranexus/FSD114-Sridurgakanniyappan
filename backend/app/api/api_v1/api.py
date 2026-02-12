from fastapi import APIRouter
from app.api.api_v1.endpoints import auth, users, courses, assignments, enrollment, notifications, certificates
from app.api.api_v1.endpoints import lessons, quizzes, progress, student_ext, teacher_ext, admin_ext, settings

api_router = APIRouter()

# New routers (Extensions likely need priority if they overlap user/course paths)
api_router.include_router(student_ext.router, tags=["student"])
api_router.include_router(teacher_ext.router, tags=["teacher"])
api_router.include_router(admin_ext.router, tags=["admin"])
api_router.include_router(settings.router, tags=["settings"])

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])
api_router.include_router(assignments.router, prefix="/assignments", tags=["assignments"])
api_router.include_router(enrollment.router, prefix="/enrollment", tags=["enrollment"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(certificates.router, prefix="/certificates", tags=["certificates"])
api_router.include_router(lessons.router, prefix="/lessons", tags=["lessons"])
api_router.include_router(quizzes.router, prefix="/quizzes", tags=["quizzes"])
api_router.include_router(progress.router, prefix="/progress", tags=["progress"])
