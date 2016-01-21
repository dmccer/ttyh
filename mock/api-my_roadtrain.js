exports.get = function(req, res) {
  res.json({
    code: 0,
    trucks: [
      {
        id: 1,
        truck_owner: '李先生',
        tel: '15601859281',
        license: '沪A19233',
        truck_type: '厢式',
        truck_length: '3.3米',
        load: '2.9吨'
      }, {
        id: 2,
        truck_owner: '李先生',
        tel: '15601859281',
        license: '沪A19233',
        truck_type: '厢式',
        truck_length: '3.3米',
        load: '2.9吨',
        default: true
      }, {
        id: 3,
        truck_owner: '李先生',
        tel: '15601859281',
        license: '沪A19233',
        truck_type: '厢式',
        truck_length: '3.3米',
        load: '2.9吨'
      }, {
        id: 4,
        truck_owner: '李先生',
        tel: '15601859281',
        license: '沪A19233',
        truck_type: '厢式',
        truck_length: '3.3米',
        load: '2.9吨'
      }
    ]
  });
}
