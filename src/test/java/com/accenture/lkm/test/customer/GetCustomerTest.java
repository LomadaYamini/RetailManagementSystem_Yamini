package com.accenture.lkm.test.customer;

import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
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

import com.accenture.lkm.bean.CustomerBean;
import com.accenture.lkm.custom.test.utils.JSONUtils;

@ExtendWith(SpringExtension.class)

@SpringBootTest

@Transactional

@WebAppConfiguration
public class GetCustomerTest {


	@Autowired
	private WebApplicationContext context;


	protected MockMvc mockMVC;


	@BeforeEach
	public void setup() {
		mockMVC = MockMvcBuilders.webAppContextSetup(context).build();
	}

	@Test
	public void getCustomerTest() throws Exception {

		String uri = "/customer/controller/getCustomersByType/Gold";
		MockHttpServletRequestBuilder request = MockMvcRequestBuilders.get(uri); //get the request
		ResultActions rest = mockMVC.perform(request); //perform the request
		MvcResult mvcResult = rest.andReturn(); //get the response

		String result = mvcResult.getResponse().getContentAsString();
		int actualStatus = mvcResult.getResponse().getStatus();

		List<CustomerBean> customer =  JSONUtils.convertFromJsonToList(result, CustomerBean.class);

		Assertions.assertNotNull(customer);
		Assertions.assertEquals("Gold", customer.get(0).getCustomerType());
		Assertions.assertEquals(actualStatus, HttpStatus.OK.value());



	}
	



	@Test
	public void getCustomerInvalidTest() throws Exception {

		String uri = "/customer/controller/getCustomersByType/Black";
		MockHttpServletRequestBuilder request= MockMvcRequestBuilders.get(uri);
		ResultActions rest= mockMVC.perform(request);
		MvcResult mvcREsult= rest.andReturn();
		//actual status and name
		int statusAct= mvcREsult.getResponse().getStatus();	


		Assertions.assertEquals(statusAct, HttpStatus.NOT_FOUND.value());



	}

}
