const MapEmbed = () => {
  return (
    <iframe
      width="100%"
      height="450"
      loading="lazy"
      className="border-none"
      allowFullScreen
      src={`https://www.google.com/maps/embed/v1/place?q=place_id:ChIJNS6DOB9RfCERVWFyK5agY0A&key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }`}
    ></iframe>
  );
};

export default MapEmbed;
