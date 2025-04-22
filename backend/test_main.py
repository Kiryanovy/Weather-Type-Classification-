import pytest
import json
import os
import tempfile
from main import app, init_db, get_db_connection
import pandas as pd
import joblib

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_db_connection():
    conn = get_db_connection()
    assert conn is not None
    conn.close()

def test_predict_endpoint_valid_data(client):
    # Dados de teste válidos
    test_data = {
        'temperature': 25,
        'humidity': 60,
        'wind_speed': 10,
        'precipitation': 20,
        'cloud_cover': 'Partly Cloudy',
        'atmospheric_pressure': 1013,
        'uv_index': 5,
        'season': 'Summer',
        'visibility': 10,
        'location': 'City'
    }
    
    response = client.post('/predict', 
                          data=json.dumps(test_data),
                          content_type='application/json')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'prediction' in data
    assert 'probability' in data

def test_predict_endpoint_missing_data(client):
    # Dados de teste com campo faltando
    test_data = {
        'humidity': 60,
        'wind_speed': 10,
        'precipitation': 20,
        'cloud_cover': 'Partly Cloudy',
        'atmospheric_pressure': 1013,
        'uv_index': 5,
        'season': 'Summer',
        'visibility': 10,
        'location': 'City'
    }
    
    response = client.post('/predict', 
                          data=json.dumps(test_data),
                          content_type='application/json')
    
    # Deve retornar erro ou usar valor padrão
    assert response.status_code in [200, 400]

def test_get_predictions(client):
    response = client.get('/predictions?page=1&per_page=10')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'predictions' in data
    assert 'total' in data

def test_get_stats(client):
    response = client.get('/stats')
    assert response.status_code == 200
    data = json.loads(response.data)
    
    # Verificar as chaves que realmente existem na resposta
    assert 'recent_predictions' in data
    assert 'total_predictions' in data
    assert 'weather_distribution' in data

