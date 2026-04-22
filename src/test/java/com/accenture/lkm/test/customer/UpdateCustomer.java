package com.accenture.lkm.test.customer;

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

import com.accenture.lkm.bean.CustomerBean;
import com.accenture.lkm.custom.test.utils.JSONUtils;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@Transactional


@WebAppConfiguration
public class UpdateCustomer {


	@Autowired
	private WebApplicationContext context;


	protected MockMvc mockMVC;

	@BeforeEach
	public void setUp() throws Exception {
		mockMVC = MockMvcBuilders.webAppContextSetup(context).build();

	}


	@Test
	public void updateCustomerTest () throws Exception {
		String uri = "/customer/controller/updateCustomer";
		CustomerBean customer = new CustomerBean();
		customer.setCustomerId(1);
		customer.setCustomerType("Platinum");
		String customerJsonFormat = JSONUtils.covertFromObjectToJson(customer);


		MockHttpServletRequestBuilder request = MockMvcRequestBuilders.put(uri)

				.content(customerJsonFormat) 
				//Data type of the data being sent to server
				.contentType(MediaType.APPLICATION_JSON) ; //get the request


		ResultActions rest = mockMVC.perform(request); //perform the request
		MvcResult mvcResult = rest.andReturn(); //get the response

		String result = mvcResult.getResponse().getContentAsString();
		int actualStatus = mvcResult.getResponse().getStatus();

		Assertions.assertTrue(result.contains("successfull"));
		Assertions.assertEquals(actualStatus, HttpStatus.OK.value());


	}


	@Test
	public void updateEmployeeInvalidTest() throws Exception{
		String uri="/emp/controller/updateEmp";
		CustomerBean customer = new CustomerBean();
		customer.setCustomerId(69);
		customer.setCustomerType("Black");
		String employeeJsonFormat =JSONUtils.covertFromObjectToJson(customer);

		MockHttpServletRequestBuilder request= MockMvcRequestBuilders.put(uri)
				
				.content(employeeJsonFormat) 
				//Data type of the data being sent to server
				.contentType(MediaType.APPLICATION_JSON) 
				;

		ResultActions rest= mockMVC.perform(request);
		MvcResult mvcREsult= rest.andReturn();
		int actualStatus = mvcREsult.getResponse().getStatus();
		Assertions.assertEquals(actualStatus,HttpStatus.NOT_FOUND.value());
	}
}
