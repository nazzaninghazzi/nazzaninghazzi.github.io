python3 -m pip install virtualenv
python3 -m virtualenv -p `which python3.10` venv
source venv/bin/activate
pip install -r requirements.txt
./tfc/manage.py makemigrations
./tfc/manage.py migrate
./tfc/manage.py createsuperuser
