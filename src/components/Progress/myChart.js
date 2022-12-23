// import {Chart} from "chart.js";

// const myChart = {
//     initDashboardPageCharts: function (defaultDate) {
//         const chartColor = "#FFFFFF";

//         // General configuration for the charts with Line gradientStroke
//         const gradientChartOptionsConfiguration = {
//             maintainAspectRatio: true,
//             legend: {
//                 display: false
//             },
//             tooltips: {
//                 bodySpacing: 4,
//                 mode: "nearest",
//                 intersect: 0,
//                 position: "nearest",
//                 xPadding: 10,
//                 yPadding: 10,
//                 caretPadding: 10
//             },
//             responsive: true,
//             scales: {
//                 yAxes: [
//                     {
//                         display: 0,
//                         ticks: {
//                             display: false
//                         },
//                         gridLines: {
//                             zeroLineColor: "transparent",
//                             drawTicks: false,
//                             display: false,
//                             drawBorder: false
//                         }
//                     }
//                 ],
//                 xAxes: [
//                     {
//                         display: 0,
//                         ticks: {
//                             display: false
//                         },
//                         gridLines: {
//                             zeroLineColor: "transparent",
//                             drawTicks: false,
//                             display: false,
//                             drawBorder: false
//                         }
//                     }
//                 ]
//             },
//             layout: {
//                 padding: {
//                     left: 0,
//                     right: 0,
//                     top: 15,
//                     bottom: 15
//                 }
//             }
//         };

//         const gradientChartOptionsConfigurationWithNumbersAndGrid = {
//             maintainAspectRatio: false,
//             legend: {
//                 display: false
//             },
//             tooltips: {
//                 displayColors: false,
//                 bodySpacing: 4,
//                 mode: "nearest",
//                 intersect: 0,
//                 position: "nearest",
//                 xPadding: 10,
//                 yPadding: 10,
//                 caretPadding: 10
//             },
//             responsive: true,
//             scales: {
//                 yAxes: [
//                     {
//                         gridLines: {
//                             zeroLineColor: "transparent",
//                             drawBorder: false
//                         }
//                     }
//                 ],
//                 xAxes: [
//                     {
//                         display: 0,
//                         ticks: {
//                             display: false
//                         },
//                         gridLines: {
//                             zeroLineColor: "transparent",
//                             drawTicks: false,
//                             display: false,
//                             drawBorder: false
//                         }
//                     }
//                 ]
//             },
//             layout: {
//                 padding: {
//                     left: 0,
//                     right: 20,
//                     top: 15,
//                     bottom: 15
//                 }
//             }
//         };

//         // var ctx = document.getElementById("bigDashboardChart").getContext("2d");
//         // ctx.canvas.width = 500;
//         // ctx.canvas.height = 150;

//         // gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
//         // gradientStroke.addColorStop(0, "#2B50ED");
//         // gradientStroke.addColorStop(1, chartColor);

//         // gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
//         // gradientFill.addColorStop(0, "rgba(214, 220, 255, 0)");
//         // gradientFill.addColorStop(1, "rgba(214, 220, 244, 0.7)");

//         // myChart = new Chart(ctx, {
//         //     type: "line",
//         //     responsive: true,
//         //     data: {
//         //         labels: defaultDate.labels,
//         //         datasets: [
//         //             {
//         //                 label: "",
//         //                 borderColor: "#2B50ED",
//         //                 pointBorderColor: "#2B50ED",
//         //                 pointBackgroundColor: "#2B50ED",
//         //                 pointBorderWidth: 2,
//         //                 pointHoverRadius: 4,
//         //                 pointHoverBorderWidth: 1,
//         //                 pointRadius: 4,
//         //                 fill: true,
//         //                 backgroundColor: gradientFill,
//         //                 borderWidth: 2,
//         //                 data: defaultDate.weight
//         //             }
//         //         ]
//         //     },
//         //     options: gradientChartOptionsConfigurationWithNumbersAndGrid
//         // });

//         let ctx = document.getElementById("lineChartExample").getContext("2d");
//         ctx.canvas.width = 500;
//         ctx.canvas.height = 150;

//         let gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
//         gradientStroke.addColorStop(0, "#2B50ED");
//         gradientStroke.addColorStop(1, chartColor);

//         let gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
//         gradientFill.addColorStop(0, "rgba(214, 220, 255, 0)");
//         gradientFill.addColorStop(1, "rgba(214, 220, 244, 0.7)");

//         let myChart = new Chart(ctx, {
//             type: "line",
//             // responsive: true,
//             data: {
//                 labels: defaultDate.labels,
//                 datasets: [
//                     {
//                         label: "",
//                         borderColor: "#2B50ED",
//                         pointBorderColor: "#2B50ED",
//                         pointBackgroundColor: "#2B50ED",
//                         pointBorderWidth: 2,
//                         pointHoverRadius: 4,
//                         pointHoverBorderWidth: 1,
//                         pointRadius: 4,
//                         fill: true,
//                         backgroundColor: gradientFill,
//                         borderWidth: 2,
//                         data: defaultDate.fat
//                     }
//                 ]
//             },
//             options: gradientChartOptionsConfigurationWithNumbersAndGrid
//         });
//     }
// };

// export default myChart;

// // jQuery(document).ready(function () {
// //     var endpoint = '/api/v1/chart/data/';
// //     var defaultLabels = []
// //     $.ajax({
// //         method: 'GET',
// //         url: endpoint,
// //         success: function (data) {
// //             myChart.initDashboardPageCharts(data);
// //         },
// //     });
// // });

// // function chartsCarousel() {
// //     var checkWidth = $(window).width();
// //     var owlPost = $(".phjs__charts-carousel");
// //     if (checkWidth > 1199) {
// //         if (typeof owlPost.data('owl.carousel') != 'undefined') {
// //             owlPost.data('owl.carousel').destroy();
// //         }
// //         owlPost.removeClass('owl-carousel');
// //     } else if (checkWidth < 1200) {
// //         owlPost.addClass('owl-carousel');
// //         owlPost.owlCarousel({
// //             margin: 10,
// //             items: 1,
// //             dots: true,
// //             dotsClass: 'charts__dots align-self-center',
// //             dotClass: 'charts__dot',
// //             stageOuterClass: 'charts__sliderContainer'
// //         });
// //     }
// // }