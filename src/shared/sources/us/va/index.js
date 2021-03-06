// Migrated from coronadatascraper, src/shared/scrapers/US/VA/index.js


const srcShared = '../../../'
const geography = require(srcShared + 'sources/_lib/geography/index.js')
const maintainers = require(srcShared + 'sources/_lib/maintainers.js')
const parse = require(srcShared + 'sources/_lib/parse.js')
const transform = require(srcShared + 'sources/_lib/transform.js')


const _counties = [
  'Accomack County',
  'Albemarle County',
  'Alexandria City',
  'Alleghany County',
  'Amelia County',
  'Amherst County',
  'Appomattox County',
  'Arlington County',
  'Augusta County',
  'Bath County',
  'Bedford County',
  'Bland County',
  'Botetourt County',
  'Bristol City',
  'Brunswick County',
  'Buchanan County',
  'Buckingham County',
  'Buena Vista City',
  'Campbell County',
  'Caroline County',
  'Carroll County',
  'Charles City County',
  'Charlotte County',
  'Charlottesville City',
  'Chesapeake City',
  'Chesterfield County',
  'Clarke County',
  'Colonial Heights City',
  'Covington City',
  'Craig County',
  'Culpeper County',
  'Cumberland County',
  'Danville City',
  'Dickenson County',
  'Dinwiddie County',
  'Emporia City',
  'Essex County',
  'Fairfax City',
  'Fairfax County',
  'Falls Church City',
  'Fauquier County',
  'Floyd County',
  'Fluvanna County',
  'Franklin City',
  'Franklin County',
  'Frederick County',
  'Fredericksburg City',
  'Galax City',
  'Giles County',
  'Gloucester County',
  'Goochland County',
  'Grayson County',
  'Greene County',
  'Greensville County',
  'Halifax County',
  'Hampton City',
  'Hanover County',
  'Harrisonburg City',
  'Henrico County',
  'Henry County',
  'Highland County',
  'Hopewell City',
  'Isle of Wight County',
  'James City County',
  'King and Queen County',
  'King George County',
  'King William County',
  'Lancaster County',
  'Lee County',
  'Lexington City',
  'Loudoun County',
  'Louisa County',
  'Lunenburg County',
  'Lynchburg City',
  'Madison County',
  'Manassas City',
  'Manassas Park City',
  'Martinsville City',
  'Mathews County',
  'Mecklenburg County',
  'Middlesex County',
  'Montgomery County',
  'Nelson County',
  'New Kent County',
  'Newport News City',
  'Norfolk City',
  'Northampton County',
  'Northumberland County',
  'Norton City',
  'Nottoway County',
  'Orange County',
  'Page County',
  'Patrick County',
  'Petersburg City',
  'Pittsylvania County',
  'Poquoson City',
  'Portsmouth City',
  'Powhatan County',
  'Prince Edward County',
  'Prince George County',
  'Prince William County',
  'Pulaski County',
  'Radford City',
  'Rappahannock County',
  'Richmond City',
  'Richmond County',
  'Roanoke City',
  'Roanoke County',
  'Rockbridge County',
  'Rockingham County',
  'Russell County',
  'Salem City',
  'Scott County',
  'Shenandoah County',
  'Smyth County',
  'Southampton County',
  'Spotsylvania County',
  'Stafford County',
  'Staunton City',
  'Suffolk City',
  'Surry County',
  'Sussex County',
  'Tazewell County',
  'Virginia Beach City',
  'Warren County',
  'Washington County',
  'Waynesboro City',
  'Westmoreland County',
  'Williamsburg City',
  'Winchester City',
  'Wise County',
  'Wythe County',
  'York County',
]

const _citiesAScounties = [
  'Alexandria',
  'Bristol',
  'Buena Vista',
  'Charlottesville',
  'Chesapeake',
  'Colonial Heights',
  'Covington',
  'Danville',
  'Emporia',
  'Falls Church',
  'Franklin',
  'Fredericksburg',
  'Galax',
  'Hampton',
  'Harrisonburg',
  'Hopewell',
  'Lexington',
  'Lynchburg',
  'Manassas',
  'Manassas Park',
  'Martinsville',
  'Newport News',
  'Norfolk',
  'Norton',
  'Petersburg',
  'Poquoson',
  'Portsmouth',
  'Radford',
  'Richmond',
  'Roanoke',
  'Salem',
  'South Boston County',
  'Staunton',
  'Suffolk',
  'Virginia Beach',
  'Waynesboro',
  'Williamsburg',
  'Winchester',
]

const fullNameCounties = [
  'Buena Vista City',
  'Fairfax City',
  'Franklin City',
  'Franklin County',
  'Manassas City',
  'Richmond City',
  'Richmond County',
  'Roanoke City',
  'Roanoke County'
]

module.exports = {
  state: 'iso2:US-VA',
  country: 'iso1:US',
  aggregate: 'county',
  timeseries: true,
  maintainers: [ maintainers.aed3, maintainers.jzohrab ],
  friendly:   {
    url: 'http://www.vdh.virginia.gov/',
    name: 'VDH',
    description: 'Virginia Department of Health',
  },
  scrapers: [
    // I'm ignoring the scrape from 2020-03-23 to 03-26: it's only 3
    // days, and it's scraping PDFs.  Migrated code is commented out
    // below in case anyone wishes to re-activate it.  jz
    /*
      {
      startDate: '2020-03-23',
      crawl: [
      {
      type: 'pdf',
      url: 'https://public.tableau.com/views/VirginiaCOVID-19Dashboard/VirginiaCOVID-19Dashboard',
      },
      ],

      // This will likely not work as-is
      scrape (data, date, helpers) {

      const pdfBaseURL = `${this.url}.pdf?:showVizHome=no&Locality=`
      const makeCacheKey = s => {
      const ret = s.toLowerCase().replace(/ /g, '')
      const check = /^[a-z]+$/
      if (check.test(ret) !== true) {
      throw new Error(`Bad cache key ${ret}`)
      }
      return ret
      }
      for (const name of this._counties) {
      let endURL = name
      if (!fullNameCounties.includes(name)) {
      endURL = endURL.slice(0, name.lastIndexOf(' '))
      }
      const pdfUrl = pdfBaseURL + endURL
      const ck = makeCacheKey(endURL)
      const pdfScrape = await fetch.pdf(this, pdfUrl, ck)
      if (pdfScrape) {
      let pdfText = ''
      for (const item of pdfScrape) {
      if (item.text === '©') {
      break
      }
      pdfText += item.text
      }
      counties.push({
      county: name,
      cases: parse.number(pdfText.match(/(\d*)Cases/)[1]),
      deaths: parse.number(pdfText.match(/(\d*)Deaths/)[1])
      })
      } else {
      counties.push({
      county: name,
      cases: 0
      })
      }
      }

      }
    */
    {
      startDate: '2020-03-26',
      crawl: [
        {
          type: 'csv',
          url: 'https://www.vdh.virginia.gov/content/uploads/sites/182/2020/03/VDH-COVID-19-PublicUseDataset-Cases.csv',
          options: { disableSSL: true }
        },
      ],
      scrape (data) {
        let counties = []
        data.forEach(location => {
          const cases = parse.number(location['Total Cases'])
          if (fullNameCounties.includes(location.Locality)) {
            const name = location.Locality
            counties.push({
              county: name,
              cases
            })
          } else if (_citiesAScounties.includes(location.Locality)) {
            location.Locality += ' City'
            const name = parse.string(location.Locality)
            counties.push({
              county: name,
              cases
            })
          } else if (this._citiesAScounties.includes(location.Locality.replace(' city', ''))) {
            location.Locality.replace(' city', ' City')
            const name = parse.string(location.Locality)
            counties.push({
              county: name,
              cases
            })
          } else {
            const name = parse.string(geography.addCounty(location.Locality))
            counties.push({
              county: name,
              cases
            })
          }
        })
        counties = geography.addEmptyRegions(counties, this._counties, 'county')
        counties.push(transform.sumData(counties))
        return counties
      }
    },
    {
      startDate: '2020-04-30',
      crawl: [
        {
          type: 'csv',
          url: 'https://www.vdh.virginia.gov/content/uploads/sites/182/2020/05/VDH-COVID-19-PublicUseDataset-Cases.csv',
          options: { disableSSL: true }
        },
      ],
      scrape (data, date) {
        let counties = []

        // The data contains many dates, only include what we want.
        // e.g., 'Report Date': '4/30/2020'
        // date will be 2020-04-30
        // console.log(date)
        const dps = date.split('-').map(s => s.replace(/^0/, '')) // remove leading zeroes
        const slashdate = `${dps[1]}/${dps[2]}/${dps[0]}`
        data = data.filter(d => {
          return d['Report Date'] === slashdate
        })
        console.log(`Filtered for ${slashdate} data count: ${data.length}`)
        data.forEach(location => {
          let name = null
          if (fullNameCounties.includes(location.Locality)) {
            name = location.Locality
          } else if (_citiesAScounties.includes(location.Locality)) {
            location.Locality += ' City'
            name = parse.string(location.Locality)
          } else if (_citiesAScounties.includes(location.Locality.replace(' city', ''))) {
            location.Locality.replace(' city', ' City')
            name = parse.string(location.Locality)
          } else {
            name = parse.string(geography.addCounty(location.Locality))
          }
          const cases = parse.number(location['Total Cases'])
          const hospitalized = parse.number(location.Hospitalizations)
          const deaths = parse.number(location.Deaths)
          counties.push({
            county: name,
            cases,
            hospitalized,
            deaths
          })
        })
        counties = geography.addEmptyRegions(counties, _counties, 'county')
        counties.push(transform.sumData(counties))
        return counties
      }
    }
  ]
}
