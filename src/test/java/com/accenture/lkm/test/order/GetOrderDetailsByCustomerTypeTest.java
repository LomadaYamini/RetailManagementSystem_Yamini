package com.accenture.lkm.test.order;

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

import com.accenture.lkm.Application;
import com.accenture.lkm.bean.OrderBean;
import com.accenture.lkm.custom.test.utils.JSONUtils;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = Application.class)
@Transactional


@WebAppConfiguration
public class GetOrderDetailsByCustomerTypeTest {


	@Autowired
	private WebApplicationContext context;

	protected MockMvc mockMVC;



	@BeforeEach
	public void setup() {
		mockMVC = MockMvcBuilders.webAppContextSetup(context).build();
	}


	@Test
	public void getOrderDetailsByCustomerTypeAndBillingRangeTest() throws Exception {
		String uri = "/order/controller/getOrderDetailsByCustomerTypeAndBillingRange/Gold--40--50";
		MockHttpServletRequestBuilder request= MockMvcRequestBuilders.get(uri);
		ResultActions rest= mockMVC.perform(request);
		MvcResult mvcREsult= rest.andReturn();

		int statusAct= mvcREsult.getResponse().getStatus();

		List<OrderBean> order= JSONUtils.convertFromJsonToList(mvcREsult.getResponse().getContentAsString(), OrderBean.class);

		Assertions.assertNotNull(order);
		Assertions.assertTrue("emilyjohnson@gmail.com".equals(order.get(0).getCustomerEmail())); 
		Assertions.assertEquals(statusAct,HttpStatus.OK.value());

	}

	@Test
	public void getOrderDetailsByCustomerTypeAndBillingRangeInvalidTest() throws Exception {
		String uri = "/order/controller/getOrderDetailsByCustomerTypeAndBillingRange/black--4000--50";
		MockHttpServletRequestBuilder request= MockMvcRequestBuilders.get(uri);
		ResultActions rest= mockMVC.perform(request);
		MvcResult mvcREsult= rest.andReturn();
		//actual status and name
		int statusAct= mvcREsult.getResponse().getStatus();	


		Assertions.assertEquals(statusAct, HttpStatus.NOT_FOUND.value());
	}





}
