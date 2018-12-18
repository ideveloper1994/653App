import moment from 'moment';
import MessageList from '../screens/today/checkup/dailyCheckUp';
import PushNotification from 'react-native-push-notification';
import {getCurrentMonth} from "./appHelper";
import {PushNotificationIOS} from "react-native";

//Manage notification
export function manageNotification(checkupTime, lastCheckupDate, userName, settingNotifications, streakMessage) {
    //Clear all notification

    PushNotification.cancelAllLocalNotifications();
    //Morning Motivation
    if(settingNotifications.length > 0 && settingNotifications[2].isSelected){
        let selectedTime = settingNotifications[2].selectedTime;
        let motivationTime = 12;
        switch (selectedTime){
            case "4am":
                motivationTime = 4;
                break;
            case "5am":
                motivationTime = 5;
                break;
            case "6am":
                motivationTime = 6;
                break;
            case "7am":
                motivationTime = 7;
                break;
            case "8am":
                motivationTime = 8;
                break;
            case "9am":
                motivationTime = 9;
                break;
            case "10am":
                motivationTime = 10;
                break;
            case "11am":
                motivationTime = 11;
                break;
        }
        manageMorningNotification(userName, motivationTime);
    }
    //Daily checkup
    if(settingNotifications.length > 0 && settingNotifications[0].isSelected){
        manageDailyCheckUpNotification(checkupTime, lastCheckupDate);
        //missing Checkup
        missingYesterday(lastCheckupDate, userName);
    }

    //goal complete
    if(settingNotifications.length > 0 && settingNotifications[1].isSelected) {
        if (streakMessage !== "") {
            let streakTime = moment().add(1,'days').toDate();
            streakTime.setHours(7);
            streakTime.setMinutes(0);
            streakTime.setSeconds(0);
            PushNotification.localNotificationSchedule({
                message: streakMessage,
                date: streakTime
            });
        }
    }
    //Monthly Notification
    setMonthlyNotification()
}

//Yesterday missing
export function missingYesterday(lastCheckupDate, userName) {
    let todayDate = moment().format("YYYY-MM-DD");
    let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
    let dayBeforeYesterday = moment().subtract(2, 'days').format('YYYY-MM-DD');
    let hour = new Date().getHours();
    if(hour < 16 && lastCheckupDate == dayBeforeYesterday) {
        try {
            //If user missed checkup alert at 7am
            if (hour < 7) {
                let missedCheckupMessage = "You missed your checkup yesterday. Complete it now.";
                let missedCheckupTime = new Date();
                missedCheckupTime.setHours(8);
                missedCheckupTime.setMinutes(0);
                missedCheckupTime.setSeconds(0);
                PushNotification.localNotificationSchedule({
                    message: missedCheckupMessage,
                    date: missedCheckupTime
                });
                //  console.log("---------Set Missing Daily checkup notification for hour after: " + 7 + '-----------')
                if (hour < 16) {
                    //If user still missed checkup alert at 4pm
                    let notDoneCheckupMessage = userName + ", take a minute to complete yesterday’s checkup.";
                    let notDoneCheckup = new Date();
                    notDoneCheckup.setHours(16);
                    notDoneCheckup.setMinutes(0);
                    notDoneCheckup.setSeconds(0);
                    PushNotification.localNotificationSchedule({
                        message: notDoneCheckupMessage,
                        date: notDoneCheckup
                    });
                    // console.log("---------Set Missing Daily checkup notification for hour after: " + 16 + '-----------')
                }
            }
        } catch (ex) {

        }
    }else if(lastCheckupDate != todayDate) {
        let missedCheckupMessage = "You missed your checkup yesterday. Complete it now.";
        let missedCheckupTime = moment().add(1,'days').toDate();
        missedCheckupTime.setHours(8);
        missedCheckupTime.setMinutes(0);
        missedCheckupTime.setSeconds(0);
        PushNotification.localNotificationSchedule({
            message: missedCheckupMessage,
            date: missedCheckupTime
        });
        let notDoneCheckupMessage = userName + ", take a minute to complete yesterday’s checkup.";
        let notDoneCheckup = moment().add(1,'days').toDate();
        notDoneCheckup.setHours(16);
        notDoneCheckup.setMinutes(0);
        notDoneCheckup.setSeconds(0);
        PushNotification.localNotificationSchedule({
            message: notDoneCheckupMessage,
            date: notDoneCheckup
        });
    }
}


//daily checkup message
export function manageDailyCheckUpNotification (checkupTime, lastCheckupDate) {
    let hour = new Date().getHours();
    let todayDate = moment().format("YYYY-MM-DD");

    if(lastCheckupDate !== todayDate && hour < checkupTime){
        setCheckUpData(checkupTime,0);
    }
    // if(hour < checkupTime){
    //     setCheckUpData(checkupTime,0);
    // }
    setCheckUpData(checkupTime,1);
    setCheckUpData(checkupTime,2);
}

export function setCheckUpData (checkupTime,afterDay) {
    try {
        let notificationDate = moment().toDate();
        if (afterDay > 0) {
            notificationDate = moment().add(afterDay,'days').toDate();
        }
        notificationDate.setHours(checkupTime);
        notificationDate.setMinutes(0);
        notificationDate.setSeconds(0);
        let notificationMessage = "It's time for your checkup!";
        PushNotification.localNotificationSchedule({
            message: notificationMessage,
            date: notificationDate
        });
        // console.log("---------Set Daily checkup notification after Days "+ afterDay + '-----------' )
    } catch (ex){

    }
}

//Morning Motivation
export function manageMorningNotification (userName, motivationTime) {
    let hour = new Date().getHours();
    let index = parseInt(moment.duration(moment(new Date()).diff(moment().startOf('year'))).asDays());
    let today = index;
    let tomorrow = 0;
    let dayAfterTomorrow = 0;
    if(index<364){
        tomorrow = index + 1;
        dayAfterTomorrow = index + 2;
    }else if(index === 364){
        tomorrow = index + 1;
        dayAfterTomorrow = 1;
    }else if(index === 365 ){
        tomorrow = 1;
        dayAfterTomorrow = 2;
    }
    if(hour<8){
        setMorningData(userName,today,0, motivationTime)
    }
    setMorningData(userName,tomorrow,1, motivationTime);
    setMorningData(userName,dayAfterTomorrow,2, motivationTime);
}

export function setMorningData (userName,index,afterDay, motivationHour) {
    try {
        let intHours = 8;
        if(typeof motivationHour == "number"){
            intHours = parseInt(motivationHour);
        }
        let motivationTime = moment().toDate();
        if (afterDay > 0) {
            motivationTime = moment().add(afterDay, 'days').toDate();
        }
        motivationTime.setHours(intHours);
        motivationTime.setMinutes(0);
        motivationTime.setSeconds(0);
        let quote = MessageList[index] || "";
        let motivationMessage = "Good morning " + userName + ". '" + quote + "'";
        PushNotification.localNotificationSchedule({
            message: motivationMessage,
            date: motivationTime
        });
        //console.log("---------Set Daily Morning notification after Days "+ afterDay + 'with Quote '+ quote+ 'and index'+index+ '-----------' )
    }catch (ex){
    }
}

export function setMonthlyNotification () {
    try {
        let nextYearMonth = 1;
        let startingLoop = 2;
        if(new Date().getDate() == 1 && new Date().getHours() < 8){
                startingLoop = 2;
        }
        for(var i=startingLoop; i<=7; i++) {
            let nextMonth = new Date().getMonth() + i;
            let year = new Date().getFullYear();
            if(nextMonth > 12){
                    nextMonth = nextYearMonth;
                    nextYearMonth += 1;
                    year = year + 1;
            }
            let monthFullname = getCurrentMonth(nextMonth-1);

            let monthString = (nextMonth.toString().length == 1) && "0"+nextMonth || nextMonth;
            let dateString = year + "-" + monthString + "-" + "01";

            let monthlyDate = moment(dateString).toDate();  //YYYY-MM-DD
            monthlyDate.setHours(8);
            monthlyDate.setMinutes(0);
            monthlyDate.setSeconds(0);
            let monthlyMessage = monthFullname + " is here. Complete the "+ monthFullname +" challenge and make this an amazing month.";
            PushNotification.localNotificationSchedule({
                message: monthlyMessage,
                date: monthlyDate
            });
        }
    }catch (ex){
    }
}