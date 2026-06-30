function CustomBagdeNotification({ notification, children }) {
    return (
        <div className="relative inline-flex items-center rounded-lg">
            {children}
            <div className="absolute -top-2 -right-2 inline-flex h-4 w-4 items-center justify-center rounded-full border border-white bg-red-300 text-[10px] font-bold text-white">
                {notification}
            </div>
        </div>
    );
}

export default CustomBagdeNotification;
