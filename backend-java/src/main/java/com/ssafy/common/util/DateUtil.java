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
}
