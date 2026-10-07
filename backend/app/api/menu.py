from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import FoodItem, Category
from app.schemas.schemas import FoodItemResponse, CategoryResponse

router = APIRouter(prefix="/menu", tags=["menu"])

@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).order_by(Category.display_order.asc()).all()
    return categories

@router.get("", response_model=List[FoodItemResponse])
def get_menu(
    category: Optional[str] = Query(None, description="Category slug"),
    search: Optional[str] = Query(None, description="Search query"),
    veg_only: Optional[bool] = Query(None, description="Filter veg items only"),
    availability: Optional[str] = Query(None, description="Availability status"),
    db: Session = Depends(get_db)
):
    query = db.query(FoodItem)

    if category and category.lower() != "all":
        cat_obj = db.query(Category).filter(Category.slug == category.lower()).first()
        if cat_obj:
            query = query.filter(FoodItem.category_id == cat_obj.id)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (FoodItem.name.ilike(search_filter)) | 
            (FoodItem.description.ilike(search_filter))
        )
    
    if veg_only is True:
        query = query.filter(FoodItem.is_veg == True)

    if availability:
        query = query.filter(FoodItem.availability == availability.upper())

    items = query.order_by(FoodItem.category_id.asc(), FoodItem.name.asc()).all()
    return items

@router.get("/{item_id}", response_model=FoodItemResponse)
def get_food_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(FoodItem).filter(FoodItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Food item not found")
    return item
