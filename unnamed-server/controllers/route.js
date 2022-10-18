const { Sequelize, sequelize } = require("../models")
const uuid = require('uuid')

const createRoute = async (req, res) => {
  const { lat_from, long_from, lat_to, long_to } = req.body
  const dateNow = Sequelize.NOW
  const id = uuid.v4()

  if (!(lat_from && long_from && lat_to && long_to)) {
    res.send({
      status: 'Error',
      message: 'All input is required'
    })
  }

  const query = `
    INSERT INTO routes VALUES(
      '${id}', ST_GeomFromText('POINT(${long_from} ${lat_from})', 4326),
      ST_GeomFromText('POINT(${long_to} ${lat_to})', 4326),
      ST_GeomFromText(concat('LINESTRING', regexp_replace('(${long_from} ${lat_from}, ${long_to} ${lat_to})',
      '(\[|\])', '', 'g'))), '${dateNow}', '${dateNow}'
    ) RETURNING *
  `

  try {
    const route = await sequelize.query(query)

    res.send({
      status: 'Success',
      data: route[0][0]
    })
  } catch (error) {
    res.send({
      status: 'Error',
      message: error.message
    })
  }
}

module.exports = { createRoute }