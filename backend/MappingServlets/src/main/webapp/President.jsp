
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>President Information</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .card {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            padding: 30px;
            width: 400px;
            text-align: center;
        }
        .card h1 {
            color: #333;
            margin-bottom: 10px;
        }
        .card h2 {
            color: #555;
            font-size: 1.2em;
            margin-top: 0;
            font-weight: normal;
        }
        .info p {
            font-size: 1em;
            color: #666;
            line-height: 1.6;
        }
        .info strong {
            color: #333;
        }
    </style>
</head>
<body>

<%-- JSP Scriptlet to define Java variables --%>
<%
    String name = "Chin Qian"; // Or Yap Han Lim, based on your context
    String title = "President";
    String society = "Computer Science Society";

%>

<div class="card">
    <%-- JSP Expressions to display the variables --%>
    <h1><%= name %></h1>
    <h2><%= title %></h2>
    <div class="info">
        <p><strong>Society:</strong> <%= society %></p>
    </div>
</div>

</body>
</html>
