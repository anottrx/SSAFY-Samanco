package com.ssafy.common.util;

//import static org.junit.jupiter.api.Assertions.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import java.util.List;
import java.util.Map;

import static com.ssafy.common.util.JsonUtil.getListMapFromString;

class JsonUtilTest {
    public static void main(String[] args) throws ParseException, JsonProcessingException {
        String test="[{\"java\": 1}, {\"python\":3}, {\"HTML\": 2}]";
        List<Map<String, Integer>> results = getListMapFromString(test);
        System.out.println(results);
    }

}