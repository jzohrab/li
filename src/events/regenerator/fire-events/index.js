const arc = require('@architect/functions')
const sorter = require('@architect/shared/utils/sorter.js')
const datetime = require('@architect/shared/datetime/index.js')

module.exports = async function fireEvents (source) {
  const { scrapers } = source
  let counter = 0

  let earliest = sorter(scrapers.map(s => s.startDate))[0]

  // In the future perhaps we can do something smarter than starting from startDate
  const today = new Date()
  const d = new Date(earliest)
  let dates = []
  while (d < today) {
    d.setDate(d.getDate() + 1)
    dates.push(datetime.getYYYYMMDD(d))
  }

  // The return of el cheapo queue
  let queue = 0
  const events = dates.map(date => {
    return new Promise ((resolve, reject) => {
      setTimeout(() => {
        arc.events.publish({
          name: 'scraper',
          payload: {
            date,
            source: source._sourceKey
          }
        }, function done (err) {
          if (err) return reject(err)
          else {
            counter++
            return resolve()
          }
        })
      }, queue)
      queue += 1000
    })
  })

  return Promise.all(events).then(() => {
    console.log(`Published ${counter} of ${dates.length} regeneration eents`)
  })
}
