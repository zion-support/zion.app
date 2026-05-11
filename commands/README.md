# Zion Tech Group – Machine Learning Pipeline for Conversion Prediction

This pipeline trains a Gradient Boosting model on historical lead data and exports an inference API.

## Installation
```bash
pip install pandas numpy scikit-learn joblib
```

## Usage

### Train the model
```bash
python3 zion_ml_pipeline.py --train
```

### Run inference API
```bash
python3 zion_ml_pipeline.py --serve
```

### Test a quick prediction
```bash
python3 zion_ml_pipeline.py --test
```

## API Endpoint
```http
POST /predict-conversion
Content-Type: application/json

{
  "time_on_site": 120,
  "pages_visited": 5,
  "email_opened": 1,
  "clicked_cta": 1
}
```

Response:
```json
{
  "probability": 0.75,
  "prediction": 1
}
```

## Model Training
- Uses historical lead data from `leads.csv`.
- Trains a Gradient Boosting classifier.
- Saves the model to `models/conversion_model.pkl`.

## Inference API
- Runs on `http://localhost:8000/predict-conversion`.
- Accepts POST requests with lead data.
- Returns conversion probability and binary prediction.

## Cron Job
Add to crontab for hourly retraining:
```cron
0 * * * * cd /path/to/workspace && python3 zion_ml_pipeline.py --train >> logs/cron.log 2>&1
```

## Dependencies
- pandas
- numpy
- scikit-learn
- joblib
- flask (for API, if needed)

## Configuration
- Update `leads.csv` with your historical lead data.
- Adjust feature columns in `preprocess()` function as needed.

## Logging
All actions are logged to `Zion_Brain_Log.md` for auditability.