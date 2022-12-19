
def validate_lat_long(lat, long):
    if lat < -90 or lat > 90:
        return False
    if long < -180 or long > 180:
        return False
    return True