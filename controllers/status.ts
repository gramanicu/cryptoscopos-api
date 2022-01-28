const status = ({ response }: { response: any }) => {
    response.body = { msg: 'OK' };
    response.status = 200;
};

export default status;
