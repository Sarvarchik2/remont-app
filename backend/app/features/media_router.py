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
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {"url": f"/static/uploads/{unique_filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-multiple")
async def upload_multiple(files: list[UploadFile] = File(...)):
    urls = []
    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        for file in files:
            file_extension = os.path.splitext(file.filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = os.path.join(UPLOAD_DIR, unique_filename)
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            urls.append(f"/static/uploads/{unique_filename}")
        
        return {"urls": urls}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
