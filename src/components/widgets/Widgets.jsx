import { useEffect, useState } from "react";
import apiClient from "../../spotify";
import WidgetCard from "./widgetCard/WidgetCard";
import "./widgets.css";

const Widgets = ({ artistID }) => {
  const [similar, setSimilar] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [newReleases, setNewReleases] = useState([]);

  useEffect(() => {
    apiClient
      .get(`/artists/${artistID}/related-artists`)
      .then((response) => {
        const artists = response.data?.artists.slice(0, 3);
        setSimilar(artists);
      })
      .catch((err) => {
        console.log(err);
      });

    apiClient
      .get("/browse/featured-playlists")
      .then((response) => {
        const playlists = response.data?.playlists?.items.slice(0, 3);
        setFeatured(playlists);
      })
      .catch((err) => {
        console.log(err);
      });

    apiClient
      .get("/browse/new-releases")
      .then((response) => {
        const albums = response.data?.albums?.items.slice(0, 3);
        setNewReleases(albums);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [artistID]);

  return (
    <div className="widgets-container flex">
      <WidgetCard title="Related Artists" similar={similar} />
      <WidgetCard title="Featured Playlists" featured={featured} />
      <WidgetCard title="New Releases" newReleases={newReleases} />
    </div>
  );
};

export default Widgets;
