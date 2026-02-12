from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User

def fix_active_users():
    db: Session = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"Found {len(users)} users.")
        count = 0
        for user in users:
            if not user.is_active:
                print(f"Activating user: {user.email}")
                user.is_active = True
                count += 1
            else:
                 print(f"User {user.email} is already active.")
        
        if count > 0:
            db.commit()
            print(f"Successfully activated {count} users.")
        else:
            print("No inactive users found.")
            
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_active_users()
