import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-9xl font-extrabold text-gray-900">404</h1>
                <p className="text-2xl md:text-3xl font-light text-gray-500 mb-8">
                    Sorry, we couldn't find this page.
                </p>
                <Link to="/">
                    <Button className="px-8 py-3 font-semibold rounded-md btn-primary-gradient">
                        Go Home
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
