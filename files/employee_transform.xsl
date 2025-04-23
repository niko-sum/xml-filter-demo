<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <!-- Parameters for filtering -->
  <xsl:param name="department" select="'all'"/>
  <xsl:param name="title" select="'all'"/>
  
  <xsl:template match="/">
    <div>
      
      <table>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Department</th>
          <th>Title</th>
        </tr>
        
        <!-- Filter employees with XPath -->
        <xsl:for-each select="employees/employee">
          <!-- Apply department filter -->
          <xsl:if test="$department = 'all' or department = $department">
            <!-- Apply title filter -->
            <xsl:if test="$title = 'all' or title = $title">
              <tr>
                <td><xsl:value-of select="@id"/></td>
                <td><xsl:value-of select="concat(firstName, ' ', lastName)"/></td>
                <td><xsl:value-of select="email"/></td>
                <td><xsl:value-of select="department"/></td>
                <td><xsl:value-of select="title"/></td>
              </tr>
            </xsl:if>
          </xsl:if>
        </xsl:for-each>
      </table>
    </div>
  </xsl:template>
</xsl:stylesheet>