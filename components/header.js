const Header = () => (
    <div className="w-full bg-[#fbf0e3] p-3 flex items-center">
        <img
            src="/favicon.ico"
            alt="Favicon"
            className="w-9 h-9 mr-3"
        />
        <h1
                    className="text-3xl font-bold flex-1 text-pretty"
                    style={{
                        background: "linear-gradient(to right, #0ab39c, rgb(78, 143, 248), red, yellow, green)",
                        WebkitBackgroundClip: "text", 
                        color: "transparent", 
                        display: "inline-block", 
                    }}
                >
                    Excelrs
                </h1>
    </div>
);

export default Header;
