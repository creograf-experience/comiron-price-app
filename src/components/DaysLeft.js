import React from "react";

import CountDown from "react-native-countdown-component";

import { JustText, JustMainText } from "../components";
import { colors } from "../constants";

import { getDayMonthYear, getTimeUntilEnddate } from "../utils";
import { strings } from "../../locale/i18n";

export const DaysLeft = ({ dateStr }) => {
  const { day, month, year } = getDayMonthYear(dateStr);
  const {
    milliseconds,
    secondsLeft,
    minutesLeft,
    daysLeft,
    hoursLeft,
  } = getTimeUntilEnddate(dateStr);
  let countdown = hoursLeft * 60 * 60 + minutesLeft * 60 + secondsLeft;
  let currentTime = new Date();
  let additionalTime = new Date(dateStr);
  additionalTime.setHours(75, 0, 0, 0);
  const additionalDay = `${("0" + additionalTime.getUTCDate()).slice(-2)}`;
  const currentDay = `${("0" + currentTime.getUTCDate()).slice(-2)}`;

  if (milliseconds <= 0 && daysLeft + 4 > 0) {
    return (
      <JustMainText>
        До выкупа {`${additionalDay - currentDay > 1 ? "осталось" : "остался"}`} {additionalDay - currentDay} {`${additionalDay - currentDay > 1 ? "дня" : "день"}`}
      </JustMainText>
    //   <>
    //   <CountDown
    //     size={10}
    //     until={temp}
    //     onFinish={() => ""}
    //     style={{ alignItems: "flex-start" }}
    //     digitStyle={{
    //         backgroundColor: "#FFF",
    //         borderWidth: 1,
    //         borderColor: colors.colorPrimary,
    //     }}
    //     digitTxtStyle={{ color: colors.colorPrimary  }}
    //     timeLabelStyle={{
    //         color: colors.colorPrimary ,
    //         fontWeight: "bold",
    //         fontSize: 10,
    //         marginLeft: 4,
    //     }}
    //     separatorStyle={{ color: colors.colorPrimary, marginBottom: 15 }}
    //     timeToShow={[ "D" ]}
    //     timeLabels={{
    //       d: "д.",
    //     }}
    //     showSeparator
    //   />
    // </>
    );
  }

  if (milliseconds <= 0) {
    return (
      <JustMainText>
        {strings("daysLeft.complete")} {day}.{month}.{year}
      </JustMainText>
    );
  }

  if (hoursLeft === 1 && daysLeft === 0) {
    return <JustText>{strings("daysLeft.lessHour")}</JustText>;
  }

  return (
    <>
      {
        daysLeft > 0 ? (
          <JustText>
            {daysLeft} {strings("daysLeft.day")} {hoursLeft}{" "}
            {strings("daysLeft.hour")}
          </JustText>
        ) 
        : (
          <CountDown
            size={10}
            until={countdown}
            onFinish={() => ""}
            style={{ alignItems: "flex-start" }}
            digitStyle={{
              backgroundColor: "#FFF",
              borderWidth: 1,
              borderColor: colors.colorPrimary,
            }}
            digitTxtStyle={{ color: colors.colorPrimary  }}
            timeLabelStyle={{
              color: colors.colorPrimary ,
              fontWeight: "bold",
              fontSize: 10,
              marginLeft: 4,
            }}
            separatorStyle={{ color: colors.colorPrimary, marginBottom: 15 }}
            timeToShow={[ "H", "M", "S" ]}
            timeLabels={{
              h: strings("coopScreen.timerHours"),
              m: strings("coopScreen.timerMinutes"),
              s: strings("coopScreen.timerSeconds"),
            }}
            showSeparator
          />
        )
      }
    </>
  );
};
