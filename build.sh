set -o errexit

pip install --upgrade pip
pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate

python manage.py collectstatic --noinput