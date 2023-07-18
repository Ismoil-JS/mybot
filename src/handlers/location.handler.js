
export default async (lat, lon) => {
    const location = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=$%7B${lat}%7D+$%7B${lon}%7D&key=87f526f534114673b84ec3e7d9b3adda`)

    const parsed_location = await location.json()

    return parsed_location
}