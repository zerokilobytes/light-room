test1 = {
    name: "Test 1",
    lives: 5,
    durtations: 30000,
    fixtures: [
        {
            type: Bulb,
            data: {x: 300, y: 600, rotation: 90}
        },
//        {
//            type: Pendulum,
//            data: {x: 200, y: 100, rotation: 0}
//        },
        {
            type: Crate,
            data: {x: 200, y: 100, rotation: 0}
        }
    ],
    actors: [],
    actions: [
        {
            intervals: 0,
            event: function() {

            }
        }
    ]
};