
var JWT
var xpPerMonth = {};
var modXpPerMonth = {};
var categories = new Array
var xpAmount = new Array
var projectsCompleted = {}
var projectsCompletedPerMonth = new Array 
var userId = ""
var categories2 = [
    '2022 Nov', '2022 Dec', '2023 Jan', '2023 Feb', '2023 Mar',
    '2023 Apr', '2023 May', '2023 Jun', '2023 Jul', '2023 Aug',
    '2023 Sep', '2023 Oct', '2023 Nov', '2023 Dec', '2024 Jan'
  ];

var categories3 = [
    '2022-11', '2022-12', '2023-01', '2023-02', '2023-03', '2023-04',
    '2023-05', '2023-06', '2023-07', '2023-08', '2023-09', '2023-10',
    '2023-11', '2023-12', '2024-01'
];




export async function loginUser() {
    try {
        const username = "siimkiskonen@gmail.com"; 
        const password = "68vKFrmXqW8v7@f";

     
        const base64Credentials = btoa(`${username}:${password}`);

        const response = await fetch("https://01.kood.tech/api/auth/signin", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${base64Credentials}`,
                "Content-Type": "application/json"
            },
        });
        JWT = await response.json();
       console.log("This is JWT", JWT);  
       
    } catch (error) {
        console.error("error with login", error);
    } 
    return JWT
}



export async function display(query) {
   // const JWT = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0NjQ1IiwiaWF0IjoxNzA0Mzc3Mjg2LCJpcCI6IjE4NS45Ny4yNTEuMTIxLCAxNzIuMjMuMC4yIiwiZXhwIjoxNzA0NDYzNjg2LCJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsidXNlciJdLCJ4LWhhc3VyYS1jYW1wdXNlcyI6Int9IiwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLXVzZXItaWQiOiI0NjQ1IiwieC1oYXN1cmEtdG9rZW4taWQiOiI1ODk5YmZkOC1iOTgwLTRkNGUtOWFhMC01MTYyMDk3ZTZmZGUifX0._gsOAwIwaV2kBWkz6w7idPkZDp_rV3j_yXTkz2GRHvk"
    try {
        
        const response = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql",{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${JWT}`
            },
            
            body: JSON.stringify({
              query: query
            })
          
        })
        const data = await response.json()
       // console.log("[DISPLAY]",data)
        return data

    } catch (error) {
        console.error("error with login", error)
        return null;//
    }
}
export async function main() {

    let query = `{
        user {
          id
          login
      
        }
      }`
    JWT = await loginUser()
    let data = await display(query)
    userId = data.data.user[0].id
    var queryXP = `query {
      transaction(
        where: {
          userId: { _eq: ${userId} }
          type: { _eq: "xp"}
          path:{ _nlike: "%piscine%"}
        },
        order_by: { createdAt: desc }
      ) {
        id
        type
        amount
        userId
        attrs
        createdAt
        path
      }
    }`
    console.log(queryXP)
    let data2 = await display(queryXP)

    console.log(data, "")
    let username = data.data.user[0].login
    console.log("Username", data.data.user[0].login)

    console.log(data2, "")
    console.log("First execrcise XP: ", data2.data.transaction[0].amount, "length of", (data2.data.transaction.length))
    sumUpXP(data2)


    const greeting = document.getElementById("greeting")
    if (username) {
      greeting.innerHTML = `Welcome to the forum ${username}`
    }
   
    
    
}



export function logoutUser() {
  // Clear the JWT or session storage/local storage token
  JWT = null;
  // If using sessionStorage or localStorage
  // sessionStorage.removeItem('token');
  // localStorage.removeItem('token');

  // Redirect to the login page or home page
  window.location.href = 'index.html'; // Change to your login page
}


function sumUpXP(data) {
    var total = 0 
    var total4 = 0

    for(var month of categories3) {
        xpPerMonth[month] = 0 
        modXpPerMonth[month] = 0
        projectsCompleted[month] = 0
    }
    
    for (let i = 0; i < data.data.transaction.length; i++) {
        total += data.data.transaction[i].amount
        var monthYear = new Date(data.data.transaction[i].createdAt).toISOString().substring(0,7);
        console.log("TEST",projectsCompleted[monthYear])
        if (projectsCompleted[monthYear] != 0) {
          projectsCompleted[monthYear]++
          console.log("do i cum")
        }
        projectsCompleted[monthYear] = (projectsCompleted[monthYear] || 1 ) 

        xpPerMonth[monthYear] = (xpPerMonth[monthYear] || 0) + data.data.transaction[i].amount
    }
      
        var total3 = 0
      
    for (const monthly in xpPerMonth) {
       console.log(xpPerMonth[monthly])
       total3 +=  xpPerMonth[monthly]
      
       modXpPerMonth[monthly] += total3 //
    }

    
    categories = Object.keys(xpPerMonth).map(String);
    xpAmount = pusthToArr(modXpPerMonth)
    projectsCompletedPerMonth = pusthToArr(projectsCompleted)
    printer(total3)


}

function printer(total3) {
  console.log(xpPerMonth)
  console.log("mod", modXpPerMonth) //correct to mundo

  console.log("TOTAL XP++:, ", total3)
  console.log("monthYear", xpPerMonth)
  console.log("ProjectsCompleted", projectsCompleted)
  console.log("ProjectsCompletedAmout", projectsCompletedPerMonth)
}

function pusthToArr(data) {
  var newArr = new Array
  for (var value in data) {
      newArr.push(data[value] )   
  }

console.log("NewArrValue", newArr)
return newArr

}

export async function addChart() {
    const app = document.getElementById("app")
    renderChart()
    renderProjectCompletionChart()
    renderAuditsChart()
    console.log("How is chart? ")
}

function renderChart() {
    var options = {
        series: [{
          name: "Desktops",
          data: xpAmount,
      }],
        chart: {
        width: 700,
        height: 300,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight',
        width: 2
      },
      title: {
        text: 'XP gained by the month',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: categories,
      },
      responsive: [{
        breakpoint: 1000, // applies when the screen width is <= 1000px
        options: {
          chart: {
            width: '100%', // Use percentage width for responsiveness
          },
          legend: {
            position: 'bottom' // Change legend position
          },
          // ... other options for this breakpoint
        }
      }]
      };

      var chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();
    
}




function renderProjectCompletionChart() {
  var options = {
      series: [{
        name: "Desktops",
        data: projectsCompletedPerMonth,
    }],
      chart: {
      width: 700,
      height: 300,
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight',
      width: 2
    },
    title: {
      text: 'Project completed per month',
      align: 'left'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    xaxis: {
      categories: categories,
    },
    responsive: [{
      breakpoint: 1000, // applies when the screen width is <= 1000px
      options: {
        chart: {
          width: '100%', // Use percentage width for responsiveness
        },
        legend: {
          position: 'bottom' // Change legend position
        },
        // ... other options for this breakpoint
      }
    }]
    };

    var chart = new ApexCharts(document.querySelector("#chart2"), options);
    chart.render();
  
}

function renderAuditsChart() {
  var options = {
      series: [{
        name: "Desktops",
        data: projectsCompletedPerMonth,
    }],
      chart: {
      width: 700,
      height: 300,
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight',
      width: 5
    },
    title: {
      text: 'Audits done',
      align: 'left'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    xaxis: {
      categories: categories,
    },
    responsive: [{
      breakpoint: 1000, // applies when the screen width is <= 1000px
      options: {
        chart: {
          width: '100%', // Use percentage width for responsiveness
        },
        legend: {
          position: 'bottom' // Change legend position
        },
        // ... other options for this breakpoint
      }
    }]
    };

    var chart = new ApexCharts(document.querySelector("#chart3"), options);
    chart.render();
  
}
