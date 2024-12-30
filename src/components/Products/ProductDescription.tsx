import React from "react";

function SingleProductDescription(): JSX.Element {
  return (
    <div className="space-y-8 mb-32">
      {/* Tabs Navigation */}
      <div className="flex space-x-4 border-b">
        {[
          { id: "description", label: "Description" },
          { id: "info", label: "Excessive Info" },
          { id: "review", label: "Review" },
        ].map((tab) => (
          <button
            key={tab.id}
            className="pb-2 border-b-2 focus:outline-none focus:border-orange-500"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div>
        <div id="description" className="space-y-4">
          <p className="text-gray-600">
            This is a type of food that is specifically formulated and intended
            for consumption by pets. It is usually sold in the form of dry
            kibble or wet cans, and is designed to meet the nutritional needs of
            a variety of different types of pets, including dogs, cats, and
            small animals like guinea pigs and rabbits.
          </p>
          <p className="text-gray-600">
            This food may help from a variety of different ingredients,
            including meat, grains, vegetables, and fortified vitamins and
            minerals. Some pet food is formulated for specific life stages, such
            as puppy or senior, and may contain higher levels of certain
            nutrients to support the needs of pets at those stages of life.
          </p>
          <p className="text-gray-600">
            At the end, also formulated for pets with special dietary needs,
            such as those with food allergies or sensitivities.
          </p>
        </div>
        <div id="info" className="hidden">
          <table className="table-auto w-full border-collapse">
            <tbody>
              {[
                ["Protein", "25%, to build and repair tissues, produce enzymes, and maintain healthy organs."],
                ["Fats", "0.5%, They also help keep the skin and coat healthy."],
                ["Carbohydrates", "10%, provide energy and help pets maintain healthy weight."],
                ["Minerals", "20%, Help building strong bones, maintaining healthy muscles."],
                ["Vitamins", "15.5%, Essential for a variety of functions in the body."],
                ["Animal", "For Dog, Cat."],
              ].map(([key, value]) => (
                <tr key={key}>
                  <td className="border px-4 py-2 font-semibold">{key}</td>
                  <td className="border px-4 py-2">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div id="review" className="hidden">
          <h3 className="text-xl font-bold mb-4">Review (02):</h3>
          <ul className="space-y-6">
            {[
              {
                name: "Rocky Mike",
                date: "06 July, 2022",
                comment:
                  "I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born.",
                rating: 5,
              },
              {
                name: "Rony Jhon",
                date: "07 July, 2022",
                comment:
                  "I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born.",
                rating: 5,
              },
            ].map((review, index) => (
              <li key={index} className="flex space-x-4">
                <img
                  src={`/assets/images/bg/review-Image-${index + 1}.png`}
                  alt="Reviewer"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h5 className="font-semibold">{review.name}</h5>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex space-x-1 text-orange-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <i key={i} className="bi bi-star-fill"></i>
                    ))}
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SingleProductDescription;
