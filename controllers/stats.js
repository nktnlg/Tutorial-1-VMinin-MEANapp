const moment = require('moment')
const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

function getOrdersMap(orders = []) {
    const daysOrder = {}

    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY')
        if (date === moment().format('DD.MM.YYYY')) {
            return
        }
        if (!daysOrder[date]) {
            daysOrder[date] = []
        }
        daysOrder[date].push(order)
    })

    return daysOrder
}

function calculateIncome(orders = []) {
    return orders.reduce((total, order) => {
        const orderCost = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity
        }, 0)
        return total += orderCost
    }, 0)
}

module.exports.overview = async function (req, res) {
    try {
        const allOrders = await Order.find({user: req.user._id}).sort({date: 1})
        const ordersMap = getOrdersMap(allOrders)
        const yesterdayOrders = ordersMap[moment().add(-1, "d").format('DD.MM.YYYY')] || []


        //Yesterday orders quantity
        const yesterdayOrdersQuantity = yesterdayOrders.length
        //Quantity of Orders
        const totalOrdersQuantity = allOrders.length
        //Days quantity
        const daysQuantity = Object.keys(ordersMap).length
        //Per day orders quantity
        const ordersPerDay = (totalOrdersQuantity / daysQuantity).toFixed(0)
        //Yesterday orders quantity percentage
        //((yesterday orders quantity/ per day orders quantity) - 1) * 100
        const yesterdayOrdersPercentage =(((yesterdayOrdersQuantity/ordersPerDay)- 1) * 100).toFixed(2)
        //Total income
        const totalIncome = calculateIncome(allOrders)
        // Average daily income
        const dailyIncome = totalIncome / daysQuantity
        //Yesterday income
        const yesterdayIncome = calculateIncome(yesterdayOrders)
        //Yesterday income percentage
        const yesterdayIncomePercentage = (((yesterdayIncome/dailyIncome)- 1) * 100).toFixed(2)
        //Income comparison
        const compareIncome = (yesterdayIncome - dailyIncome).toFixed(2)
        //Orders quantity comparison
        const compareQuantity = (yesterdayOrdersQuantity - ordersPerDay).toFixed(2)

        const answer = {
            income: {
                percent: Math.abs(+yesterdayIncomePercentage),
                compare: Math.abs(+compareIncome),
                yesterday: +yesterdayIncome,
                isHigher: +yesterdayIncomePercentage > 0
            },
            orders: {
                percent: Math.abs(+yesterdayOrdersPercentage),
                compare: Math.abs(+compareQuantity),
                yesterday: +yesterdayOrdersQuantity,
                isHigher: +yesterdayOrdersPercentage > 0
            }
        }

        res.status(200).json(answer)

    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.analytics = async function (req, res) {
   try {
       const allOrders = await Order.find(({user: req.user.id})).sort({date: 1})
       const ordersMap = getOrdersMap(allOrders)

       const average = +(calculateIncome(allOrders) / Object.keys(ordersMap).length).toFixed(2)

       const chart = Object.keys(ordersMap).map(label => {
           //label == dd.mm.yyyy
           const income = calculateIncome(ordersMap[label])
           const orders = ordersMap[label].length
           return {
               label, orders, income
           }
       })

       res.status(200).json({
           average,
           chart
       })
   }
   catch (e) {errorHandler(res, e)}
}
