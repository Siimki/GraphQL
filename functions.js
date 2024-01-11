
var JWT
var xpPerMonth = {};
var modXpPerMonth = {};
var categories = new Array
var xpAmount = new Array
var auditsDoneArray = new Array
var auditsRecievedArray = new Array 
var auditsRecievedPerMonth = new Array
var auditsCompleted
var projectsCompleted = {}
var projectsCompletedPerMonth = new Array 
var auditsDown = {};
var auditsUp = {};
var userId = ""
var data
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

let query = `{
  user {
    id
    login

  }
}`





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

    JWT = await loginUser()
    data = await display(query)
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
    let username = data.data.user[0].login
    sumUpXP(data2)
    greetUser(username)
    let auditsDone = await queryAudits("up")
    let auditsRecieved = await queryAudits("down")
    //console.log("Audits done",auditsDone)
     auditsCompleted, auditsDoneArray = sumUpAuditsAmount(auditsDone)
     auditsRecievedPerMonth, auditsRecievedArray = sumUpAuditsAmount(auditsRecieved)
   //console.log("call audits completed", auditsCompleted)
    console.log("Audits Done Array ", auditsDoneArray)
    console.log("call audits recieved", auditsRecievedPerMonth)
    console.log("AuditsRecieved Peer month", auditsRecievedArray)

}

function greetUser(username) {
  const greeting = document.getElementById("greeting")
  if (username) {
    greeting.innerHTML = `Welcome to the forum ${username}`
  }
}

export function logoutUser() {
  // Clear the JWT or session storage/local storage token
  JWT = null;
  window.location.href = 'index.html'; 
}

function sumUpAuditsAmount(data) {
  auditsDown = {}
  for (var month of categories3) {
    auditsDown[month] = 0
  }
  var total = 0 
  for (let i = 0; i < data.data.transaction.length; i++) {
    total += data.data.transaction[i].amount
    var monthYear = new Date(data.data.transaction[i].createdAt).toISOString().substring(0,7);
    console.log("AUDITSAMOUNT",auditsDown[monthYear])
    if (auditsDown[monthYear] != 0) {
      auditsDown[monthYear]++
    } 

    auditsDown[monthYear] = (auditsDown[monthYear] || 1)

    
  }
  console.log("AUDITSDOWN", auditsDown)
  var totalPerMonth
  var auditsPerMonth = pusthToArr(auditsDown)



  

  return auditsDown, auditsPerMonth
}

function sumUpXP(data) {
    var total = 0 

    for (var month of categories3) {
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

export async function queryAudits(type) {
  var queryAudit = `query {
    transaction(
      where: {
        userId: { _eq: 4645 }
        type: { _eq: ${type}}
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

   data = await display(queryAudit)
   return data
}

function renderChart() {
    var options = {
        series: [{
          name: "Desktops",
          data: xpAmount,
      }],
      chart: {
        height: 350,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
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
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      }

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
      height: 350,
      type: 'line',
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: false
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
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5
    }
    };

    var chart = new ApexCharts(document.querySelector("#chart2"), options);
    chart.render();
  
}

function renderAuditsChart() {
  var options = {
    series: [
    {
      name: "Audits done",
      data: auditsDoneArray
    },
    {
      name: "Audits recieved",
      data: auditsRecievedArray
    }
  ],
    chart: {
    height: 350,
    type: 'line',
    dropShadow: {
      enabled: true,
      color: '#000',
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2
    },
    toolbar: {
      show: false
    }
  },
  colors: ['#77B6EA', '#545454'],
  dataLabels: {
    enabled: true,
  },
  stroke: {
    curve: 'smooth'
  },
  title: {
    text: 'Audits done and recieved!',
    align: 'left'
  },
  grid: {
    borderColor: '#e7e7e7',
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  markers: {
    size: 1
  },
  xaxis: {
    categories: categories,
    title: {
      text: 'Month'
    }
  },
  yaxis: {
    title: {
      text: 'Audits completed per month'
    },
    min: 5,
    max: 40
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5
  }
  };

  var chart = new ApexCharts(document.querySelector("#chart3"), options);
  chart.render();
  
}

