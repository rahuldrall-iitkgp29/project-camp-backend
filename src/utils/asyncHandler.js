const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err)); //next(err) will give express inbuilt error
  };
};

export { asyncHandler };

/*
this is a higher order fn
we take a fn (requestHandler) as a input and return a fn [def of an higher order fn]
*/
/*
now we directly use this instead of writing try catch in each controler
we pass our async fn(promise) , its check that , if our input promise have any kind of error then promise rejected and it go to catch
Then:
next(err)
passes the error to Express's error-handling middleware.
*/
