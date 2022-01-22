import api, { fileUrl } from "./index";

async function registAPI(inputState, formData) {
    // async function registAPI(inputState) {
        return await fileUrl
    .post("/api/project", {
        collectStatus: inputState.collectStatus,
        description: inputState.description,
        endDate:inputState.endDate,
        hostId: inputState.hostId,
        hostPosition: inputState.hostPosition,
        stacks: inputState.stacks,
        startDate: inputState.startDate,
        title: inputState.title,
        totalEmbeddedSize: inputState.totalEmbeddedSize,
        formData
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}

export {
    registAPI
}