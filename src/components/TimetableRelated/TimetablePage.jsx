import Header from "components/Header/MainHader/Header";
import Timetable from "components/TimetableRelated/Timetable";
import "components/Default.css"

function TimetablePage(){


    return (
      <div id="TimetablePage" className="default-root-value">
        <div className="content-container">
          <div className="header">
            <Header isMainPage={false} />
          </div>
          <div className="body">
            <Timetable />
          </div>
        </div>
      </div>
    );
}

export default TimetablePage;