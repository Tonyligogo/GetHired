import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
  } from "@react-email/components";
  import * as React from "react";
  
  export const KoalaWelcomeEmail = ({
    firstName,
    companyName,
    jobTitle
  }) => (
    <Html>
      <Head />
      <Preview>
        GetHired is happy to inform you that you have been hired for the job that you applied for.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={paragraph}>Hi {firstName},</Text>
          <Text style={paragraph}>
          We are thrilled to inform you that you have been selected for the position of {jobTitle} at {companyName}. Your skills and experience stood out among the candidates, and {companyName} is confident that you are the best candidate for their project.
          </Text>
          <Text style={paragraph}>
            Best,
            <br />
            The GetHired team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Nairobi
          </Text>
        </Container>
      </Body>
    </Html>
  );
  
  export default KoalaWelcomeEmail;
  
  const main = {
    backgroundColor: "#ffffff",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
  };
  
  const logo = {
    margin: "0 auto",
  };
  
  const paragraph = {
    fontSize: "16px",
    lineHeight: "26px",
  };
  
  const btnContainer = {
    textAlign: "center",
  };
  
  const button = {
    backgroundColor: "#5F51E8",
    borderRadius: "3px",
    color: "#fff",
    fontSize: "16px",
    textDecoration: "none",
    textAlign: "center" ,
    display: "block",
    padding: "12px",
  };
  
  const hr = {
    borderColor: "#cccccc",
    margin: "20px 0",
  };
  
  const footer = {
    color: "#8898aa",
    fontSize: "12px",
  };
  