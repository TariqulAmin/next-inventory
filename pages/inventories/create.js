import { useEffect, useState, useContext } from "react";
import axiosClient from "../../axios-client.js";
import UserContext from "../../context/UserContext";
import DefaultLayout from "../../components/DefaultLayout"
import { useRouter } from "next/router";

function InventoryForm() {
    const router = useRouter();
    const { id } = router.query
    const { setNotification } = useContext(UserContext);

    const [inventory, setInventory] = useState({
        name: "",
        description: "",
    });
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (id) {
            setLoading(true);
            axiosClient
                .get(`/inventories/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setInventory(data.data);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [id]);


    // if (id) {
    //     useEffect(() => {
    //         setLoading(true);
    //         axiosClient
    //             .get(`/inventories/${id}`)
    //             .then(({ data }) => {
    //                 setLoading(false);
    //                 setInventory(data.data);
    //             })
    //             .catch(() => {
    //                 setLoading(false);
    //             });
    //     }, []);
    // }

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (inventory.id) {
            axiosClient
                .put(`/inventories/${inventory.id}`, inventory)
                .then(() => {
                    setNotification("Inventory was successfully updated");
                    router.push("/inventories");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response) {
                        setErrors(response.data.data);
                    }
                });
        } else {
            axiosClient
                .post("/inventories", inventory)
                .then(() => {
                    setNotification("Inventory was successfully created");
                    router.push("/inventories");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response) {
                        setErrors(response.data.data);
                    }
                });
        }
    };

    return (
        <>
            <DefaultLayout>
                {inventory.id && <h1>Update User: {inventory.name}</h1>}
                {!inventory.id && <h1>New Inventory</h1>}
                <div className="card animated fadeInDown">
                    {loading && <div className="text-center">Loading...</div>}
                    {errors && (
                        <div className="alert">
                            {Object.keys(errors).map((key) => (
                                <p key={key}>{errors[key][0]}</p>
                            ))}
                        </div>
                    )}
                    {!loading && (
                        <form onSubmit={onSubmit}>
                            <input
                                value={inventory.name}
                                onChange={(ev) =>
                                    setInventory({
                                        ...inventory,
                                        name: ev.target.value,
                                    })
                                }
                                placeholder="Name"
                            />
                            <textarea
                                cols="30"
                                rows="10"
                                value={inventory.description}
                                onChange={(ev) =>
                                    setInventory({
                                        ...inventory,
                                        description: ev.target.value,
                                    })
                                }
                                placeholder="Description"
                            ></textarea>
                            <button className="btn">Save</button>
                        </form>
                    )}
                </div>
            </DefaultLayout>
        </>
    );
}

export default InventoryForm;
