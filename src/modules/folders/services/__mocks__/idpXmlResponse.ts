export const IDP_XML_RESPONSE = `<?xml version="1.0"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" entityID="http://idp-int.hetarchief.be/idp">
  <md:IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol" WantAuthnRequestsSigned="true">
    <md:KeyDescriptor use="signing">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>MIICRjCCAa+gAwIBAgIJALRK8eVTg5r0MA0GCSqGSIb3DQEBBQUAMDwxEDAOBgNVBAMMB3NzbyBpZHAxDDAKBgNVBAsMA3FhczENMAsGA1UECgwEdmlhYTELMAkGA1UEBhMCYmUwHhcNMTUxMjIxMTEyNjAwWhcNMjAxMTI0MTEyNjAwWjA8MRAwDgYDVQQDDAdzc28gaWRwMQwwCgYDVQQLDANxYXMxDTALBgNVBAoMBHZpYWExCzAJBgNVBAYTAmJlMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDNP1eVJIdVWXzHeDymWAz5O45YncphIl+V8daO/ltDB8v1OLwET3365Z5CUUO1VRmD+hScISxb5EiHLEHXZywiZJhMIh8J5+bUNfFExpdlKOjhzFp+xtJorqujNyHb/T3fIcmDyJZS/+yU6Lb0nwopv0Y8L2rneU3P/COZM6r5KwIDAQABo1AwTjAdBgNVHQ4EFgQU5zR2gHxHCci97tfB6t3B+C2uWVswHwYDVR0jBBgwFoAU5zR2gHxHCci97tfB6t3B+C2uWVswDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQUFAAOBgQBVXBWykbbcCUDuFS5PTVZCwYk1M0AUn6d3h/R7kdzUGJMAQ/Rj5iQ9ce30hjOVLZIN1kvwElXnlW27JzM3EOjuZOrwnw73SCHn69vd7cJM5eL+A51TfsF7Pi9IEfHSZsIYJM/Dz4yZTDsNt1t28B/4JaYp6GVS7rFLE+LshGsr/g==</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:KeyDescriptor use="encryption">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>MIICRjCCAa+gAwIBAgIJALRK8eVTg5r0MA0GCSqGSIb3DQEBBQUAMDwxEDAOBgNVBAMMB3NzbyBpZHAxDDAKBgNVBAsMA3FhczENMAsGA1UECgwEdmlhYTELMAkGA1UEBhMCYmUwHhcNMTUxMjIxMTEyNjAwWhcNMjAxMTI0MTEyNjAwWjA8MRAwDgYDVQQDDAdzc28gaWRwMQwwCgYDVQQLDANxYXMxDTALBgNVBAoMBHZpYWExCzAJBgNVBAYTAmJlMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDNP1eVJIdVWXzHeDymWAz5O45YncphIl+V8daO/ltDB8v1OLwET3365Z5CUUO1VRmD+hScISxb5EiHLEHXZywiZJhMIh8J5+bUNfFExpdlKOjhzFp+xtJorqujNyHb/T3fIcmDyJZS/+yU6Lb0nwopv0Y8L2rneU3P/COZM6r5KwIDAQABo1AwTjAdBgNVHQ4EFgQU5zR2gHxHCci97tfB6t3B+C2uWVswHwYDVR0jBBgwFoAU5zR2gHxHCci97tfB6t3B+C2uWVswDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQUFAAOBgQBVXBWykbbcCUDuFS5PTVZCwYk1M0AUn6d3h/R7kdzUGJMAQ/Rj5iQ9ce30hjOVLZIN1kvwElXnlW27JzM3EOjuZOrwnw73SCHn69vd7cJM5eL+A51TfsF7Pi9IEfHSZsIYJM/Dz4yZTDsNt1t28B/4JaYp6GVS7rFLE+LshGsr/g==</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://hetarchief-idp-int.do.viaa.be/saml2/idp/SingleLogoutService.php"/>
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</md:NameIDFormat>
    <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://hetarchief-idp-int.do.viaa.be/saml2/idp/SSOService.php"/>
  </md:IDPSSODescriptor>
  <md:ContactPerson contactType="technical">
    <md:GivenName>SAML</md:GivenName>
    <md:SurName>Administrator</md:SurName>
    <md:EmailAddress>alerts@viaa.be</md:EmailAddress>
  </md:ContactPerson>
</md:EntityDescriptor>
`;
