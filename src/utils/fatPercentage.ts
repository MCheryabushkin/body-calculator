const getFatPerccentage = ({gender, neck, waist, height, hip}: any) => gender === 'male'
    ? (495/(1.0324 - 0.19077*Math.log10(waist-neck) + 0.15456*Math.log10(height))-450).toFixed(2)
    : (495/(1.29579 - 0.35004*Math.log10(waist+hip-neck) + 0.22100*Math.log10(height))-450).toFixed(2);

export default getFatPerccentage;