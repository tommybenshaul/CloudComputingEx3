import requests
import pytest

# Constants
BASE_URL = "http://localhost:8000"
STATUS_CODES = {
    'OK': 200,
    'CREATED': 201,
    'BAD_REQUEST': 400,
    'NOT_FOUND': 404,
    'UNPROCESSABLE_ENTITY': 422
}
RETURN_VALUES = {
    'INVALID_DISH': '-3',
    'DUPLICATE_DISH': '-2',
}

dishes = {}

# test 1
def test_post_dishes():
    ids = []
    dish_names = ["orange", "spaghetti", "apple pie"]
    for dish_name in dish_names:
        response = requests.post(f"{BASE_URL}/dishes", json={'name': dish_name})
        response.raise_for_status()  # Raises an exception for 4xx and 5xx status codes
        assert response.status_code == STATUS_CODES['CREATED'], f"Expected status code {STATUS_CODES['CREATED']}, got {response.status_code}"

        json_response = response.json()
        dishes[dish_name] = json_response
        ids.append(json_response['ID'])

    assert len(set(ids)) == len(ids), "Expected all IDs to be unique, but they were not"

# test 2
def test_get_dish_by_id():
    orange_id = dishes['orange']['ID']

    response = requests.get(f"{BASE_URL}/dishes/{orange_id}")
    response.raise_for_status()
    assert response.status_code == STATUS_CODES['OK'], f"Expected status code {STATUS_CODES['OK']}, got {response.status_code}"

    sodium_level = response.json()['sodium']
    assert .9 <= sodium_level <= 1.1, f"Expected sodium level to be between .9 and 1.1, got {sodium_level}"

# test 3
def test_get_all_dishes():
    response = requests.get(f"{BASE_URL}/dishes}")
    response.raise_for_status()
    assert response.status_code == STATUS_CODES['OK'], f"Expected status code {STATUS_CODES['OK']}, got {response.status_code}"

    dishes_count = len(response.json())
    assert dishes_count == 3, f"Expected 3 dishes, got {dishes_count}"

# test 4
def test_post_invalid_dish():
    response = requests.post(f"{BASE_URL}/dishes", json={'name': 'blah'})

    assert response.status_code in [STATUS_CODES['BAD_REQUEST'], STATUS_CODES['NOT_FOUND'], STATUS_CODES['UNPROCESSABLE_ENTITY']], f"Expected a status code of {STATUS_CODES['BAD_REQUEST']}, {STATUS_CODES['NOT_FOUND']}, or {STATUS_CODES['UNPROCESSABLE_ENTITY']}, got {response.status_code}"
    assert response.text == RETURN_VALUES['INVALID_DISH'], f"Expected return value of {RETURN_VALUES['INVALID_DISH']}, got {response.text}"

# test 5
def test_post_duplicate_dish():
    response = requests.post(f"{BASE_URL}/dishes", json={'name': 'orange'})

    assert response.status_code in [STATUS_CODES['BAD_REQUEST'], STATUS_CODES['NOT_FOUND'], STATUS_CODES['UNPROCESSABLE_ENTITY']], f"Expected a status code of {STATUS_CODES['BAD_REQUEST']}, {STATUS_CODES['NOT_FOUND']}, or {STATUS_CODES['UNPROCESSABLE_ENTITY']}, got {response.status_code}"
    assert response.text == RETURN_VALUES['DUPLICATE_DISH'], f"Expected return value of {RETURN_VALUES['DUPLICATE_DISH']}, got {response.text}"

# test 6
def test_post_meals():

    meal = {
        "name": "delicious",
        "appetizer": dishes["orange"]["ID"],
        "main": dishes["spaghetti"]["ID"],
        "dessert": dishes["apple pie"]["ID"]
    }

    response = requests.post(f"{BASE_URL}/meals", json=meal)
    response.raise_for_status()

    assert response.status_code == STATUS_CODES['CREATED'], f"Expected status code {STATUS_CODES['CREATED']}, got {response.status_code}"
    assert response.json()['ID'] > 0, "Expected ID to be greater than 0"

# test 7
def test_get_all_meals():
    response = requests.get(f"{BASE_URL}/meals")
    response.raise_for_status()

    meals = response.json()
    assert len(meals) == 1, f"Expected 1 meal, got {len(meals)}"

    calories = meals[0]['cal']
    assert 400 <= calories <= 500, f"Expected calories to be between 400 and 500, got {calories}"
    assert response.status_code == STATUS_CODES['OK'], f"Expected status code {STATUS_CODES['OK']}, got {response.status_code}"

# test 8
def test_post_duplicate_meal():
    meal = {
        "name": "delicious",
        "appetizer": dishes["orange"]["ID"],
        "main": dishes["spaghetti"]["ID"],
        "dessert": dishes["apple pie"]["ID"]
    }

    response = requests.post(f"{BASE_URL}/meals", json=meal)

    assert response.text == RETURN_VALUES['DUPLICATE_DISH'], f"Expected return value of {RETURN_VALUES['DUPLICATE_DISH']}, got {response.text}"
    assert response.status_code in [STATUS_CODES['BAD_REQUEST'], STATUS_CODES['UNPROCESSABLE_ENTITY']], f"Expected a status code of {STATUS_CODES['BAD_REQUEST']} or {STATUS_CODES['UNPROCESSABLE_ENTITY']}, got {response.status_code}"
