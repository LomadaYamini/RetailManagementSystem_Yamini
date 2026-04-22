package com.accenture.lkm.custom.test.utils;

import java.io.IOException;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JSONUtils {
	
	//Generic Type Safe Method
	static public <T> T covertFromJsonToObject(String json, Class<T> var) throws IOException{
		ObjectMapper mapper = new ObjectMapper();
		return mapper.readValue(json, var);//Convert Json into object of Specific Type
	}

	public static String covertFromObjectToJson(Object obj) throws JsonProcessingException{
		ObjectMapper mapper = new ObjectMapper();
		return mapper.writeValueAsString(obj);
	}
	
	public static <T> List<T> convertFromJsonToList(String json, Class<T> clazz) {
	    ObjectMapper mapper = new ObjectMapper();
	    try {
	        return mapper.readValue(json,
	            mapper.getTypeFactory().constructCollectionType(List.class, clazz));
	    } catch (Exception e) {
	        e.printStackTrace();
	        return null;
	    }
	}
	
	

}