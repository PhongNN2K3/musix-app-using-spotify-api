import "./widgetEntry.css";

const WidgetEntry = ({ title, subtitle, image }) => {
  //từng related artist, playlist nổi bật, album mới nhất trong widget card
  return (
    <div className="widget-entry-body flex">
      <img className="widget-entry-img" src={image} alt={title} />
      <div className="widget-entry-right-body flex">
        <p className="widget-entry-title">{title}</p>
        <p className="widget-entry-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default WidgetEntry;
