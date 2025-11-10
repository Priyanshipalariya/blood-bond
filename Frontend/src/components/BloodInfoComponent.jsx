import {Card, CardContent} from "./Card"
import {ButtonLink} from "./Button"
import { Link } from "react-router"

const BloodInfoComponent = (props) => {
    return (
        <section className="py-14 bg-white">
            <div className=" px-5">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Blood Types & Compatibility</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Understanding blood types is crucial for successful transfusions. Check which types are compatible with yours.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4  gap-6 ">
                    {['A', 'B', 'AB', 'O'].map((type) => (
                        <Card key={type} className="overflow-hidden border-2 border-gray-200 hover:border-red-600 mx-10 sm:mx-0">
                            <CardContent className="p-6 text-center">
                                <div className="bg-red-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-red-700">{type}</span>
                                </div>
                                <h3 className="font-bold text-lg mb-2">Type {type}</h3>
                                <p className="text-sm text-gray-600">
                                    {type === 'O' ? 'Universal donor (O-)' :
                                        type === 'AB' ? 'Universal recipient (AB+)' :
                                            `Can donate to type ${type} and AB`}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Link to="/information">
                        <ButtonLink>
                            Learn more about blood types
                        </ButtonLink>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BloodInfoComponent;