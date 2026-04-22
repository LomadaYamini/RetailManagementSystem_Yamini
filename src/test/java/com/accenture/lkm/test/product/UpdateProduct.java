package com.accenture.lkm.test.product;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import com.accenture.lkm.bean.ProductBean;
import com.accenture.lkm.custom.test.utils.JSONUtils;


@ExtendWith(SpringExtension.class)
@SpringBootTest
@Transactional

@WebAppConfiguration
public class UpdateProduct {

	@Autowired
	private WebApplicationContext context;
	
	private MockMvc mockMVC;
	
	@BeforeEach
	public void setUp() {
		mockMVC = MockMvcBuilders.webAppContextSetup(context).build();
	}
	
	@Test
	public void updateProductTest() throws Exception {
		
		String uri ="/product/controller/updateProductStock";
		ProductBean product = new ProductBean();
		product.setProductId(1);
		product.setStock(100);
		String productJsonFormat = JSONUtils.covertFromObjectToJson(product);
		
		MockHttpServletRequestBuilder request = MockMvcRequestBuilders.put(uri)
				.content(productJsonFormat)
				.contentType(MediaType.APPLICATION_JSON);
		

		ResultActions rest = mockMVC.perform(request); //perform the request
		MvcResult mvcResult = rest.andReturn(); //get the response

		String result = mvcResult.getResponse().getContentAsString();
		int actualStatus = mvcResult.getResponse().getStatus();


		Assertions.assertTrue(result.contains("successfull"));
		Assertions.assertEquals(actualStatus, HttpStatus.OK.value());
		
		
	}
	
	@Test
	public void updateProductInvalidTest() throws Exception{
		String uri="/product/controller/updateProductStock";
		ProductBean product = new ProductBean();
		product.setProductId(100);
		product.setStock(100);
		String productJsonFormat = JSONUtils.covertFromObjectToJson(product);
		
		MockHttpServletRequestBuilder request= MockMvcRequestBuilders.put(uri)
				.content(productJsonFormat) 
				//Data type of the data being sent to server
				.contentType(MediaType.APPLICATION_JSON) 
				;

		ResultActions rest= mockMVC.perform(request);
		MvcResult mvcREsult= rest.andReturn();
		int actualStatus = mvcREsult.getResponse().getStatus();
		Assertions.assertEquals(actualStatus,HttpStatus.NOT_FOUND.value());		
		
	}
	
	
}
