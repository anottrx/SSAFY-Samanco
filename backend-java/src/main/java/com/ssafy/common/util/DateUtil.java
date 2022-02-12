package com.ssafy.common.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtil {
    public static String DateOrTime(String fullDate) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Calendar todayDate = Calendar.getInstance();
        todayDate.setTime(new Date()); //금일 날짜
        String strToday = sdf.format(todayDate.getTime());
//        System.out.println(fullDate);
        String[] splits = fullDate.split("T");
        String[] time = splits[1].split(":");
        if (strToday.equals(splits[0])) {
            return time[0] + ":" + time[1];
        } else {
            return splits[0];
        }
    }

    public static String DateAndTime(String fullDate) {
        String[] splits = fullDate.split("T");
        String[] time = splits[1].split(":");
        return splits[0]+" "+time[0] + ":" + time[1];

    }

    public static String Runtime(String fullDate) {
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
        Calendar todayDate = Calendar.getInstance();
        todayDate.setTime(new Date()); //금일 날짜
        String[] todayTime = sdf.format(todayDate.getTime()).split(":");
        String[] time = fullDate.split("T")[1].split(":");
        int curMin=Integer.parseInt(todayTime[1]);
        int createMin=Integer.parseInt(time[0])*60+Integer.parseInt(time[1]);
        if (Integer.parseInt(time[0])>Integer.parseInt(todayTime[0])){
            curMin+=(Integer.parseInt(todayTime[0])+24)*60;
        } else {
            curMin+=Integer.parseInt(todayTime[0])*60;
        }
        int runTimeHour=(curMin-createMin)/60;
        int runTimeMin=curMin-createMin-runTimeHour*60;
        if (runTimeHour==0){
            return runTimeMin+"분";
        }
        return runTimeHour+"시간 "+runTimeMin+"분";

    }
}
