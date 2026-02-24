import os
import shutil
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()

UPLOAD_DIR = "static/uploads"

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Create directory if it doesn't exist
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Return the URL (assuming server is at root/static/uploads)
        # Note: In production this would be a proper domain
        # For local dev, we'll return the relative path or full local URL if possible
        url = f"/static/uploads/{unique_filename}"
        
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
